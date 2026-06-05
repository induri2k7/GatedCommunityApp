-- VMS Database Schema (PostgreSQL)

CREATE TABLE communities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    subscription_status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    mobile VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    hashed_password VARCHAR(255),
    role VARCHAR(50) NOT NULL, -- 'super_admin', 'community_admin', 'tenant', 'security_guard'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_community FOREIGN KEY (community_id) REFERENCES communities(id)
);

CREATE TABLE apartments (
    id SERIAL PRIMARY KEY,
    community_id INTEGER NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    tower VARCHAR(50),
    flat_no VARCHAR(50) NOT NULL,
    tenant_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(community_id, tower, flat_no)
);

CREATE TABLE visitors (
    id SERIAL PRIMARY KEY,
    community_id INTEGER NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    tenant_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    purpose VARCHAR(255),
    visitor_type VARCHAR(50) DEFAULT 'guest', -- 'guest', 'delivery', 'cab', 'service'
    qr_code VARCHAR(255) UNIQUE, 
    qr_valid_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE visitor_logs (
    id SERIAL PRIMARY KEY,
    community_id INTEGER NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    visitor_id INTEGER REFERENCES visitors(id) ON DELETE CASCADE,
    guard_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    tenant_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    entry_time TIMESTAMP,
    exit_time TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'entered', 'exited'
    notes TEXT
);

CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    community_id INTEGER NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
