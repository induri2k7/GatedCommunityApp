from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, auth, database

router = APIRouter(prefix="/api/announcements", tags=["announcements"])

@router.post("/", response_model=schemas.Announcement)
def create_announcement(announcement: schemas.AnnouncementCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    if current_user.role not in ["super_admin", "community_admin"]:
        raise HTTPException(status_code=403, detail="Only administrators can create announcements")
    
    # If super_admin, default to community 1 for demo purposes if not specified
    community_id = current_user.community_id if current_user.community_id else 1
    
    db_announcement = models.Announcement(
        title=announcement.title,
        content=announcement.content,
        community_id=community_id,
        author_id=current_user.id
    )
    db.add(db_announcement)
    db.commit()
    db.refresh(db_announcement)
    return db_announcement

@router.get("/", response_model=List[schemas.Announcement])
def read_announcements(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    if current_user.role == "super_admin":
        return db.query(models.Announcement).all()
    else:
        return db.query(models.Announcement).filter(models.Announcement.community_id == current_user.community_id).all()
