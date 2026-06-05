from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, auth, database

router = APIRouter(prefix="/api/users", tags=["users"])

@router.post("/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    # Basic RBAC implementation
    if current_user.role not in ["super_admin", "community_admin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    db_user = auth.get_user_by_mobile(db, mobile=user.mobile)
    if db_user:
        raise HTTPException(status_code=400, detail="Mobile already registered")
        
    hashed_password = auth.get_password_hash(user.password)
    
    # If the creator is a community_admin, force the new user to be in the same community
    community_id = user.community_id
    if current_user.role == "community_admin":
        community_id = current_user.community_id

    db_user = models.User(
        first_name=user.first_name,
        last_name=user.last_name,
        mobile=user.mobile,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role,
        community_id=community_id,
        is_active=user.is_active
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_active_user)):
    return current_user

@router.get("/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    if current_user.role == "super_admin":
        users = db.query(models.User).offset(skip).limit(limit).all()
    elif current_user.role == "community_admin":
        users = db.query(models.User).filter(models.User.community_id == current_user.community_id).offset(skip).limit(limit).all()
    else:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return users
