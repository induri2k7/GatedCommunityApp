from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, users, communities, visitors, announcements

# Optional: Auto-create tables (skip in prod if using alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="VMS API",
    description="Visitor Management System SaaS API",
    version="1.0.0",
)

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(communities.router)
app.include_router(visitors.router)
app.include_router(announcements.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "VMS API is running"}
