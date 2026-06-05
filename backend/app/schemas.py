from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    first_name: str
    last_name: Optional[str] = None
    mobile: str
    email: Optional[EmailStr] = None
    role: str # super_admin, community_admin, tenant, security_guard
    is_active: bool = True
    community_id: Optional[int] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    mobile: Optional[str] = None

class CommunityBase(BaseModel):
    name: str
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None

class CommunityCreate(CommunityBase):
    pass

class Community(CommunityBase):
    id: int
    subscription_status: str
    created_at: datetime

    class Config:
        from_attributes = True

class VisitorBase(BaseModel):
    name: str
    phone: Optional[str] = None
    purpose: Optional[str] = None
    visitor_type: Optional[str] = "guest"
    tenant_id: int

class VisitorCreate(VisitorBase):
    pass

class Visitor(VisitorBase):
    id: int
    community_id: int
    qr_code: Optional[str] = None
    qr_valid_until: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AnnouncementBase(BaseModel):
    title: str
    content: Optional[str] = None

class AnnouncementCreate(AnnouncementBase):
    pass

class Announcement(AnnouncementBase):
    id: int
    community_id: int
    author_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

