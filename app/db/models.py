from sqlalchemy import Column, String, Boolean, Integer, Float, DateTime, JSON, func
from sqlalchemy.orm import DeclarativeBase
from uuid import uuid4

class Base(DeclarativeBase): pass

class ValidationRun(Base):
    __tablename__ = "validation_runs"
    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    tenant_id = Column(String, nullable=False, index=True)
    invoice_number = Column(String, nullable=False, index=True)
    invoice_date = Column(String, nullable=True)
    transaction_type = Column(String, nullable=True)
    invoice_type_code = Column(String, nullable=True)
    is_valid = Column(Boolean, nullable=False)
    total_errors = Column(Integer, default=0)
    pass_percentage = Column(Float, nullable=True)
    errors_json = Column(JSON, nullable=True)
    raw_payload = Column(JSON, nullable=True)
    duration_ms = Column(Float, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), index=True)
