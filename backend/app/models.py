from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Community(Base):
    __tablename__ = "communities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    address = Column(Text)
    city = Column(String(100))
    country = Column(String(100))
    subscription_status = Column(String(50), default='active')
    created_at = Column(DateTime, default=func.now())

    users = relationship("User", back_populates="community", cascade="all, delete-orphan")
    apartments = relationship("Apartment", back_populates="community", cascade="all, delete-orphan")
    visitors = relationship("Visitor", back_populates="community", cascade="all, delete-orphan")
    announcements = relationship("Announcement", back_populates="community", cascade="all, delete-orphan")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    community_id = Column(Integer, ForeignKey("communities.id", ondelete="CASCADE"), nullable=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100))
    mobile = Column(String(20), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    role = Column(String(50), nullable=False) # super_admin, community_admin, tenant, security_guard
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())

    community = relationship("Community", back_populates="users")
    apartments = relationship("Apartment", back_populates="tenant", foreign_keys="[Apartment.tenant_id]")

class Apartment(Base):
    __tablename__ = "apartments"

    id = Column(Integer, primary_key=True, index=True)
    community_id = Column(Integer, ForeignKey("communities.id", ondelete="CASCADE"), nullable=False)
    tower = Column(String(50))
    flat_no = Column(String(50), nullable=False)
    tenant_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    community = relationship("Community", back_populates="apartments")
    tenant = relationship("User", back_populates="apartments", foreign_keys=[tenant_id])

class Visitor(Base):
    __tablename__ = "visitors"

    id = Column(Integer, primary_key=True, index=True)
    community_id = Column(Integer, ForeignKey("communities.id", ondelete="CASCADE"), nullable=False)
    tenant_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    phone = Column(String(20))
    purpose = Column(String(255))
    visitor_type = Column(String(50), default="guest")
    qr_code = Column(String(255), unique=True)
    qr_valid_until = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now())

    community = relationship("Community", back_populates="visitors")
    tenant = relationship("User", foreign_keys=[tenant_id])
    logs = relationship("VisitorLog", back_populates="visitor", cascade="all, delete-orphan")

class VisitorLog(Base):
    __tablename__ = "visitor_logs"

    id = Column(Integer, primary_key=True, index=True)
    community_id = Column(Integer, ForeignKey("communities.id", ondelete="CASCADE"), nullable=False)
    visitor_id = Column(Integer, ForeignKey("visitors.id", ondelete="CASCADE"), nullable=True)
    guard_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    tenant_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    entry_time = Column(DateTime, nullable=True)
    exit_time = Column(DateTime, nullable=True)
    status = Column(String(50), default="pending") # pending, approved, rejected, entered, exited
    notes = Column(Text, nullable=True)

    visitor = relationship("Visitor", back_populates="logs")
    guard = relationship("User", foreign_keys=[guard_id])
    tenant = relationship("User", foreign_keys=[tenant_id])

class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    community_id = Column(Integer, ForeignKey("communities.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=func.now())

    community = relationship("Community", back_populates="announcements")
    author = relationship("User", foreign_keys=[author_id])
