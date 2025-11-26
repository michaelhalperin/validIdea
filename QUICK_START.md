# Quick Start Guide

## ✅ What's Done
- ✅ Database created and migrated
- ✅ All code implemented
- ✅ Gemini API key configured
- ✅ PostgreSQL running

## 🚀 Start the App

### 1. Start Backend (Terminal 1)
```bash
cd backend
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"
npm run dev
```

Backend will run on: http://localhost:3000

### 2. Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

Frontend will run on: http://localhost:5173

## 👤 Create Your First Account

1. Open http://localhost:5173
2. Click "Register"
3. Create an account with:
   - Email: your-email@example.com
   - Password: (at least 8 characters)

## 🎯 Test the App

1. After registering, you'll be redirected to create a new idea
2. Fill in:
   - Title: "My Startup Idea"
   - One-liner: "A brief description"
   - Description: "Detailed description of your idea"
3. Click "Analyze Idea"
4. Wait for Gemini AI to analyze (may take 30-60 seconds)
5. View the comprehensive analysis!

## ⚠️ Note About File Storage

For file uploads to work, you need to either:
- **Option A**: Set up MinIO (if using Docker)
- **Option B**: Update S3 credentials in `backend/.env` for production S3
- **Option C**: Skip file uploads for now (the app works without them)

## 🔧 Troubleshooting

### Backend won't start
- Make sure PostgreSQL is running: `brew services list | grep postgresql`
- Check `DATABASE_URL` in `backend/.env` uses your username: `postgresql://michael@localhost:5432/ideavalidate`

### Frontend can't connect to backend
- Make sure backend is running on port 3000
- Check `VITE_API_URL` in `frontend/.env` is set to `http://localhost:3000/api`

### Database errors
- Restart PostgreSQL: `brew services restart postgresql@15`
- Check connection: `psql -d ideavalidate`

## 📝 Next Steps

Once everything is running:
- Try creating multiple ideas
- Test the regenerate section feature
- Export a PDF report
- Check the admin dashboard (if you create an admin account)

Enjoy validating your startup ideas! 🚀

