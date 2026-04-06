from pydantic import BaseModel
from typing import List, Optional

class ValidationErrorItem(BaseModel):
    field: str
    error: str
    severity: str
    category: str  # FORMAT, CALCULATION, COMPLIANCE

class ValidationMetrics(BaseModel):
    total_checks: int
    passed_checks: int
    failed_checks: int
    pass_percentage: float

class ValidationReport(BaseModel):
    invoice_number: Optional[str]
    is_valid: bool
    total_errors: int
    errors: List[ValidationErrorItem]
    warnings: List[ValidationErrorItem]
    metrics: ValidationMetrics
    timestamp: str

class APIResponse(BaseModel):
    status: str
    message: str
    report: ValidationReport
