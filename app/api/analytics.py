from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.db.models import ValidationRun
import datetime
import traceback
from collections import defaultdict

router = APIRouter()

@router.get("/analytics/summary")
async def get_analytics_summary(db: Session = Depends(get_db)):
    try:
        # Fetch all runs. For massive scale we would aggregate in SQL, but for POC it's fine.
        runs = db.query(ValidationRun).all()
        
        total = len(runs)
        valid_count = sum(1 for r in runs if r.is_valid)
        failed_count = total - valid_count
        
        pass_rate = (valid_count / total * 100) if total > 0 else 0
        
        # Dynamic Category Breakdown
        category_counts = defaultdict(int)
        # Field error tracking
        field_errors = defaultdict(int)
        
        for run in runs:
            if run.errors_json and isinstance(run.errors_json, list):
                for err in run.errors_json:
                    cat = err.get("category", "COMPLIANCE")
                    field = err.get("field", "Unknown Field")
                    category_counts[cat] += 1
                    field_errors[field] += 1
        
        by_category = [{"name": k, "value": v} for k, v in category_counts.items()]
        
        # Top failing fields
        top_errors = [{"field": k, "count": v} for k, v in sorted(field_errors.items(), key=lambda item: item[1], reverse=True)[:5]]
        
        # 7-day trend
        today = datetime.datetime.now().date()
        date_counts = defaultdict(lambda: {"total": 0, "passed": 0})
        
        for run in runs:
            run_date = run.created_at.date() if run.created_at else today
            if (today - run_date).days <= 6:
                date_counts[run_date]["total"] += 1
                if run.is_valid:
                    date_counts[run_date]["passed"] += 1
        
        trend = []
        for i in range(6, -1, -1):
            target_date = today - datetime.timedelta(days=i)
            day_stats = date_counts[target_date]
            daily_pass_rate = (day_stats["passed"] / day_stats["total"] * 100) if day_stats["total"] > 0 else 0
            trend.append({
                "date": target_date.strftime("%a"),
                "pass_rate": round(daily_pass_rate, 1)
            })
            
        # Latest runs for dashboard
        latest_runs = [
            {
                "id": r.id,
                "invoice_number": r.invoice_number,
                "is_valid": r.is_valid,
                "created_at": r.created_at,
                "pass_percentage": r.pass_percentage
            }
            for r in sorted(runs, key=lambda x: x.created_at, reverse=True)[:5]
        ]
            
        return {
            "total": total,
            "pass_rate": round(pass_rate, 1),
            "failures": failed_count,
            "by_category": by_category,
            "trend": trend,
            "top_errors": top_errors,
            "latest_runs": latest_runs
        }
    except Exception as e:
        print(f"Error in analytics: {e}")
        traceback.print_exc()
        return {
            "total": 0, "pass_rate": 0, "failures": 0,
            "by_category": [], "trend": [], "top_errors": []
        }
