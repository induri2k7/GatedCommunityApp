from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, auth, database

router = APIRouter(prefix="/api/communities", tags=["communities"])

@router.post("/", response_model=schemas.Community)
def create_community(community: schemas.CommunityCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    if current_user.role != "super_admin":
        raise HTTPException(status_code=403, detail="Only super_admin can create communities")
    
    db_community = models.Community(
        name=community.name,
        address=community.address,
        city=community.city,
        country=community.country
    )
    db.add(db_community)
    db.commit()
    db.refresh(db_community)
    return db_community

@router.get("/", response_model=List[schemas.Community])
def read_communities(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    if current_user.role == "super_admin":
        return db.query(models.Community).offset(skip).limit(limit).all()
    elif current_user.role in ["community_admin", "tenant", "security_guard"]:
        return db.query(models.Community).filter(models.Community.id == current_user.community_id).all()
    else:
        raise HTTPException(status_code=403, detail="Not enough permissions")
