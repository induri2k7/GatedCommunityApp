from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
import uuid
from .. import models, schemas, auth, database

router = APIRouter(prefix="/api/visitors", tags=["visitors"])

@router.post("/", response_model=schemas.Visitor)
def create_visitor(visitor: schemas.VisitorCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    # Tenants creating their own visitors, or Guards creating visitors manually
    if current_user.role not in ["tenant", "security_guard"]:
        raise HTTPException(status_code=403, detail="Not permitted to create visitors")

    if current_user.role == "tenant" and visitor.tenant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Can only create visitors for yourself")

    # Generate QR Code string
    qr_code_str = str(uuid.uuid4())
    qr_valid_until = datetime.utcnow() + timedelta(hours=24) # Valid for 24h

    db_visitor = models.Visitor(
        community_id=current_user.community_id,
        tenant_id=visitor.tenant_id,
        name=visitor.name,
        phone=visitor.phone,
        purpose=visitor.purpose,
        visitor_type=visitor.visitor_type,
        qr_code=qr_code_str,
        qr_valid_until=qr_valid_until
    )
    db.add(db_visitor)
    db.commit()
    db.refresh(db_visitor)

    # If created by guard, automatically create a pending log
    if current_user.role == "security_guard":
        db_log = models.VisitorLog(
            community_id=current_user.community_id,
            visitor_id=db_visitor.id,
            guard_id=current_user.id,
            tenant_id=visitor.tenant_id,
            status="pending"
        )
        db.add(db_log)
        db.commit()

    return db_visitor

@router.get("/", response_model=List[schemas.Visitor])
def get_visitors(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    if current_user.role == "tenant":
        return db.query(models.Visitor).filter(models.Visitor.tenant_id == current_user.id).all()
    elif current_user.role in ["security_guard", "community_admin", "super_admin"]:
        # If no community id, return all for super admin
        if current_user.role == "super_admin":
             return db.query(models.Visitor).all()
        return db.query(models.Visitor).filter(models.Visitor.community_id == current_user.community_id).all()
    else:
         raise HTTPException(status_code=403, detail="Not permitted")

@router.put("/{qr_code}/approve", response_model=schemas.Visitor)
def approve_visitor(qr_code: str, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    if current_user.role != "security_guard":
        raise HTTPException(status_code=403, detail="Only security guards can scan and approve")
    
    visitor = db.query(models.Visitor).filter(models.Visitor.qr_code == qr_code).first()
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor pass not found or invalid QR")
    
    # Check expiry
    if visitor.qr_valid_until and visitor.qr_valid_until < datetime.utcnow():
        raise HTTPException(status_code=400, detail="QR pass has expired")
        
    # Log the entry
    new_log = models.VisitorLog(
        community_id=visitor.community_id,
        visitor_id=visitor.id,
        guard_id=current_user.id,
        tenant_id=visitor.tenant_id,
        entry_time=datetime.utcnow(),
        status="entered"
    )
    db.add(new_log)
    db.commit()
    db.refresh(visitor)
    return visitor
