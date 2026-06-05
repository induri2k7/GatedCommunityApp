import requests
import json

BASE_URL = "http://localhost:8000/api"

# Helper print
def log(msg):
    print(f"[*] {msg}")

def seed():
    log("Seeding Database...")
    
    # 1. We create the super admin manually in DB or via API if allowed.
    # In a real app we'd directly insert a Super Admin or assume it exists.
    # For demo, the schema.sql doesn't pre-populate. Let's assume the API doesn't need auth 
    # for the seed script just for the sake of the demo, or we need to insert via SQL.
    # Since we added RBAC, we actually need token. 
    
    log("Note: To fully seed via API, you need a SuperAdmin token.")
    log("Alternatively, run the following SQL script in your postgres DB:")
    
    sql_seed = """
INSERT INTO communities (name, city, country) VALUES ('Sunset Villas', 'Dubai', 'UAE');
INSERT INTO communities (name, city, country) VALUES ('Palm Grove', 'Abu Dhabi', 'UAE');

-- password is 'password123'
INSERT INTO users (community_id, first_name, last_name, mobile, email, hashed_password, role) VALUES 
(NULL, 'Super', 'Admin', '+971500000000', 'super@vms.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjIQqiRQmO', 'super_admin'),
(1, 'Community', 'Manager', '+971500000001', 'manager@sunset.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjIQqiRQmO', 'community_admin'),
(1, 'Ali', 'Husain', '+971501234567', 'ali@tenant.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjIQqiRQmO', 'tenant'),
(1, 'Security', 'Guard', '+971509999999', 'guard@sunset.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjIQqiRQmO', 'security_guard');

INSERT INTO apartments (community_id, tower, flat_no, tenant_id) VALUES 
(1, 'Tower A', 'A-101', 3);
"""
    print(sql_seed)
    
    with open("seed_data.sql", "w") as f:
        f.write(sql_seed)
        
    log("Saved to seed_data.sql! You can run this against the DB container: docker exec -i <db_container> psql -U vms_user -d vms_db < seed_data.sql")

if __name__ == "__main__":
    seed()
