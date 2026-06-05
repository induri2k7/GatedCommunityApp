# Visitor Management System (VMS) SaaS

A complete production-ready, scalable, multi-tenant Visitor Management System built for residential communities.

## Architecture Stack
- **Backend**: FastAPI (Python 3.11), SQLAlchemy, PostgreSQL, Redis
- **Frontend (Admin Web)**: Next.js (TypeScript), TailwindCSS
- **Mobile App**: Flutter (iOS & Android)

## Project Structure
- `/schema.sql` - Core database schema.
- `/docker-compose.yml` - Local development environment orchestration.
- `/backend/` - FastAPI application providing REST API and Swagger Docs.
- `/admin-web/` - Next.js Back-Office portal.
- `/mobile_app/` - Flutter App for Tenants and Security Guards.
- `/seed.py` - Script to populate demo data.

## Getting Started (Local Development)

### 1. Database & Backend Services
**Option A: Using Docker (Recommended)**
Run the docker container to spin up PostgreSQL, Redis, and the FastAPI Backend automatically:
```bash
docker compose up --build -d
```

**Option B: Running Bare-Metal (No Docker)**
If you do not have Docker installed, the application will automatically fall back to using a local SQLite database.
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The Backend API will be available at `http://localhost:8000`.
The **Swagger API Documentation** is automatically generated and hosted at `http://localhost:8000/docs`.

### 2. Seeding Sample Data
To create demo communities, tenants, and guards:
```bash
# Ensure you run this inside your python environment or backend container
pip install requests
python seed.py
```

### 3. Admin Web Office
Ensure Node.js is installed.
```bash
cd admin-web
npm install
npm run dev
```
The Admin Portal will be available at `http://localhost:3000`. Use the mock login pages to explore Super Admin and Community Admin flows.

### 4. Mobile Application
Ensure Flutter is installed.
```bash
cd mobile_app
flutter pub get
flutter run
```
You can switch between the Tenant Dashboard and Security Guard dashboard directly from the login screen.

## Deployment Guide (Production)

### Backend (AWS ECS or EC2)
1. Build the docker image using `/backend/Dockerfile`.
2. Push to ECR.
3. Deploy to AWS ECS using Fargate. Connect to an AWS RDS PostgreSQL instance and ElastiCache Redis.
4. Put the service behind AWS ALB and configure a Domain with HTTPS.

### Admin Web (Vercel or AWS Amplify)
1. Connect the `admin-web` folder to Vercel.
2. Ensure you set the environment variable `NEXT_PUBLIC_API_URL` to your backend's external domain.
3. Deploy automatically via git hooks.

### Mobile Apps (Stores)
1. Run `flutter build apk --release` and `flutter build ipa`.
2. Distribute through Google Play Console and Apple App Store Connect.

## Multi-Developer & Team Sync Guidelines

To support multiple teams working from different desktops, follow these guidelines to keep your code in sync and avoid merge conflicts:

### 1. Daily Sync Routine
- **Pull Latest Changes**: Always run `git pull origin main` before starting any development work.
- **Commit & Push Often**: Push small, logical commits to feature branches (e.g., `git checkout -b feature/your-feature`) and create Pull Requests (PRs) on GitHub rather than pushing directly to `main`.

### 2. Isolated Environment Setup (Ignored Files)
Local settings and databases are excluded from Git via `.gitignore` to prevent developers from overwriting each other's local state:
- **Local SQLite Database**: The SQLite database (`backend/vms_local.db`) is ignored. When cloning the repository on a new machine, run:
  ```bash
  cd backend
  # Run the seed script to create and seed your local SQLite database:
  .\venv\Scripts\python.exe seed_sqlite.py
  ```
- **Dependencies**: After pulling new changes, ensure dependencies are updated:
  - Backend: `pip install -r requirements.txt`
  - Admin Web: `npm install`
  - Mobile App: `flutter pub get`
- **Secrets & Local IPs**: Credentials, keystores, and local testing configurations (like the local IP address on the mobile login screen) should remain local and not be committed.

## Security & Multitenancy
- **Authentication**: JWT based using bcrypt hashing. Role validation (`super_admin`, `community_admin`, `tenant`, `guard`) restricts endpoints.
- **Multitenancy**: Data isolation is enforced at the database logic level using a mandatory `community_id` column for all community-specific tables, filtered in the API tier.

