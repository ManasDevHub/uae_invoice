from fastapi import APIRouter
from pydantic import BaseModel
from app.models.invoice import InvoicePayload

router = APIRouter()

from uuid import uuid4
from datetime import datetime, timezone

class ASPValidateResponse(BaseModel):
    asp_status: str
    message: str
    invoice_number: str
    timestamp: str

class ASPSubmitResponse(BaseModel):
    asp_status: str
    clearance_id: str
    invoice_number: str
    timestamp: str
    fta_reference: str

@router.post("/validate", response_model=ASPValidateResponse)
def mock_asp_validate(invoice: InvoicePayload):
    """
    Mocks the ASP (Accredited Service Provider) Validation API.
    In a real-world scenario, this endpoint would forward the invoice 
    to the specific ASP configured for the given tenant/client.
    """
    return ASPValidateResponse(
        asp_status="ACCEPTED",
        message="Invoice accepted for FTA submission",
        invoice_number=invoice.invoice_number,
        timestamp=datetime.now(timezone.utc).isoformat()
    )

@router.post("/submit", response_model=ASPSubmitResponse)
def mock_asp_submit(invoice: InvoicePayload):
    """
    Mocks the ASP Submission API (FTA integration phase).
    Returns a simulated clearance ID as proof of tax submission.
    """
    return ASPSubmitResponse(
        asp_status="CLEARED",
        clearance_id=f"CLR-{uuid4().hex[:10].upper()}",
        invoice_number=invoice.invoice_number,
        timestamp=datetime.now(timezone.utc).isoformat(),
        fta_reference=f"FTA-AE-{uuid4().hex[:8].upper()}"
    )
