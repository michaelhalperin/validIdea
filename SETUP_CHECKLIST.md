# Setup Checklist - IdeaValidate

## ✅ What's Already Done
- ✅ Project structure created
- ✅ All code files implemented
- ✅ Gemini API key added to `.env`
- ✅ Prisma client generated
- ✅ Dependencies installed

## 🔧 What You Need to Do Before Running

### 1. Start Database & Storage Services

**Option A: Using Docker Compose (Recommended)**
```bash
# If you have docker-compose (older version)
docker-compose up -d

# OR if you have newer Docker (compose as plugin)
docker compose up -d
```

**Option B: Manual PostgreSQL Setup**
- Install PostgreSQL locally
- Create database: `createdb ideavalidate`
- Update `DATABASE_URL` in `backend/.env`

### 2. Run Database Migrations

```bash
cd backend
npm run prisma:migrate
```

This will:
- Create all database tables
- Set up the schema

### 3. Seed the Database (Optional but Recommended)

```bash
cd backend
npm run seed
```

This creates:
- Admin user: `admin@ideavalidate.com` / `admin123`
- Demo user: `demo@example.com` / `user123`
- Sample idea

### 4. Initialize MinIO Bucket (If using Docker)

1. Open MinIO console: http://localhost:9001
2. Login: `minioadmin` / `minioadmin`
3. Create bucket named: `ideavalidate`

**OR** if not using MinIO, update S3 settings in `.env` to use your S3 bucket.

### 5. Start Backend Server

```bash
cd backend
npm run dev
```

Backend should run on: http://localhost:3000

### 6. Start Frontend Server

```bash
cd frontend
npm run dev
```

Frontend should run on: http://localhost:5173

## 🚀 Quick Start (All Commands)

```bash
# 1. Start services
docker compose up -d  # or docker-compose up -d

# 2. Setup database
cd backend
npm run prisma:migrate
npm run seed

# 3. Initialize MinIO (open http://localhost:9001 and create bucket "ideavalidate")

# 4. Start backend (in one terminal)
cd backend
npm run dev

# 5. Start frontend (in another terminal)
cd frontend
npm run dev
```

## ⚠️ Common Issues

### Database Connection Error
- Make sure PostgreSQL is running
- Check `DATABASE_URL` in `backend/.env`
- Verify database exists: `psql -U postgres -l`

### MinIO/S3 Errors
- Create the bucket manually in MinIO console
- Or update S3 credentials in `.env` for production S3

### Gemini API Errors
- Verify API key is correct in `backend/.env`
- Check API key has proper permissions
- Ensure you have API quota available

### Port Already in Use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Change port in `frontend/vite.config.ts`

## 📝 Environment Variables to Check

Make sure these are set in `backend/.env`:
- ✅ `GEMINI_API_KEY` - Already added
- ✅ `DATABASE_URL` - Should point to your PostgreSQL
- ✅ `JWT_SECRET` - Change from default in production
- ⚠️ `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - Optional (for OAuth)

## 🎯 Test the App

1. Open http://localhost:5173
2. Click "Register" or use demo credentials
3. Create a new idea
4. Wait for analysis to generate
5. View results and export PDF

## 📚 Next Steps

- Add Google OAuth credentials if you want OAuth login
- Configure production S3 bucket
- Set up proper JWT secret for production
- Review and adjust rate limits and credits

