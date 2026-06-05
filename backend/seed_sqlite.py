import os
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app import models
from app.auth import get_password_hash

def seed_db():
    print("[*] Ensuring database tables are created...")
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    try:
        # Check if community exists
        sunset = db.query(models.Community).filter(models.Community.name == 'Sunset Villas').first()
        if not sunset:
            print("[*] Creating Sunset Villas community...")
            sunset = models.Community(
                name='Sunset Villas',
                city='Dubai',
                country='UAE',
                address='Al Barsha'
            )
            db.add(sunset)
            db.commit()
            db.refresh(sunset)
        
        palm = db.query(models.Community).filter(models.Community.name == 'Palm Grove').first()
        if not palm:
            print("[*] Creating Palm Grove community...")
            palm = models.Community(
                name='Palm Grove',
                city='Abu Dhabi',
                country='UAE',
                address='Yas Island'
            )
            db.add(palm)
            db.commit()
            db.refresh(palm)

        # Check and create users
        # 1. Super Admin
        super_admin = db.query(models.User).filter(models.User.mobile == '+971500000000').first()
        if not super_admin:
            print("[*] Creating Super Admin...")
            super_admin = models.User(
                community_id=None,
                first_name='Super',
                last_name='Admin',
                mobile='+971500000000',
                email='super@vms.com',
                hashed_password=get_password_hash('password123'),
                role='super_admin'
            )
            db.add(super_admin)
        
        # 2. Community Admin (Manager)
        comm_admin = db.query(models.User).filter(models.User.mobile == '+971500000001').first()
        if not comm_admin:
            print("[*] Creating Community Admin...")
            comm_admin = models.User(
                community_id=sunset.id,
                first_name='Community',
                last_name='Manager',
                mobile='+971500000001',
                email='manager@sunset.com',
                hashed_password=get_password_hash('password123'),
                role='community_admin'
            )
            db.add(comm_admin)
            
        # 3. Tenant (Ali Husain)
        tenant = db.query(models.User).filter(models.User.mobile == '+971501234567').first()
        if not tenant:
            print("[*] Creating Tenant...")
            tenant = models.User(
                community_id=sunset.id,
                first_name='Ali',
                last_name='Husain',
                mobile='+971501234567',
                email='ali@tenant.com',
                hashed_password=get_password_hash('password123'),
                role='tenant'
            )
            db.add(tenant)
            
        # 4. Security Guard
        guard = db.query(models.User).filter(models.User.mobile == '+971509999999').first()
        if not guard:
            print("[*] Creating Security Guard...")
            guard = models.User(
                community_id=sunset.id,
                first_name='Security',
                last_name='Guard',
                mobile='+971509999999',
                email='guard@sunset.com',
                hashed_password=get_password_hash('password123'),
                role='security_guard'
            )
            db.add(guard)
            
        db.commit()
        db.refresh(tenant)
        
        # Check and create apartment
        apt = db.query(models.Apartment).filter(models.Apartment.tenant_id == tenant.id).first()
        if not apt:
            print("[*] Creating Apartment A-101 for Tenant...")
            apt = models.Apartment(
                community_id=sunset.id,
                tower='Tower A',
                flat_no='A-101',
                tenant_id=tenant.id
            )
            db.add(apt)
            db.commit()
            
        print("[*] Database seeded successfully!")
    except Exception as e:
        db.rollback()
        print(f"[!] Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
