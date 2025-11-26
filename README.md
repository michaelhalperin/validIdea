# IdeaValidate - Gemini-Powered Startup Idea Validator

A full-stack web application that uses Google Gemini AI to analyze startup ideas and provide comprehensive reports including market analysis, competitor research, SWOT analysis, technical feasibility, cost estimates, and roadmaps.

## Features

- **AI-Powered Analysis**: Uses Google Gemini API to generate structured startup analysis
- **User Authentication**: Email/password and Google OAuth login
- **Idea Submission**: Submit ideas with descriptions and attachments (images, PDFs, slides, videos)
- **Comprehensive Reports**: Get detailed analysis including:
  - Executive summary
  - Market size & trends
  - Top competitors with links
  - SWOT analysis
  - Technical feasibility assessment
  - Cost estimates
  - 3-phase roadmap
  - Investor pitch templates
- **PDF Export**: Download analysis reports as PDFs
- **History Dashboard**: View and manage all your past analyses
- **Admin Dashboard**: Monitor usage statistics and user activity
- **Rate Limiting**: Monthly credit system to manage API usage

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Material-UI (MUI)
- React Router
- React Query (TanStack Query)
- Axios

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Google Gemini API
- Passport.js (OAuth)
- Puppeteer (PDF generation)
- AWS SDK (S3/MinIO storage)

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for local development)
- Google Gemini API key
- Google OAuth credentials (optional, for OAuth login)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd ideavalidate
```

### 2. Start Docker services

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- MinIO (S3-compatible storage) on ports 9000 and 9001

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ideavalidate?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/google/callback"

# Gemini API
GEMINI_API_KEY="your-gemini-api-key"

# File Storage (S3/MinIO)
S3_ENDPOINT="http://localhost:9000"
S3_BUCKET="ideavalidate"
S3_ACCESS_KEY="minioadmin"
S3_SECRET_KEY="minioadmin"
S3_REGION="us-east-1"
S3_USE_SSL="false"

# URLs
FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX_REQUESTS="100"

# Monthly Credits
MONTHLY_CREDITS_PER_USER="10"

# Node Environment
NODE_ENV="development"
```

Run database migrations:

```bash
npm run prisma:migrate
npm run prisma:generate
```

Seed the database with demo data:

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### 5. Initialize MinIO Bucket

Access MinIO console at `http://localhost:9001` (login: minioadmin/minioadmin) and create a bucket named `ideavalidate`.

## Demo Credentials

After running the seed script, you can use these credentials:

- **Admin**: admin@ideavalidate.com / admin123
- **User**: demo@example.com / user123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user

### Ideas
- `POST /api/ideas` - Create new idea
- `GET /api/ideas` - Get user's ideas
- `GET /api/ideas/:id` - Get specific idea
- `POST /api/ideas/:id/generate` - Generate analysis
- `POST /api/ideas/:id/regenerate-section` - Regenerate specific section
- `POST /api/ideas/:id/attachments` - Upload file attachment

### Export
- `GET /api/export/:id/pdf` - Export analysis as PDF

### Admin
- `GET /api/admin/usage` - Get usage statistics
- `GET /api/admin/users` - Get all users

## Deployment

For detailed deployment instructions including environment configuration for both development and production, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Setup

**Frontend (Vercel)**:
- Set `VITE_API_URL=https://valididea.onrender.com/api` in Vercel environment variables

**Backend (Render)**:
- Set `FRONTEND_URL=https://valid-idea.vercel.app` in Render environment variables
- Set `ALLOWED_ORIGINS=https://valid-idea.vercel.app` for CORS
- Configure all other required environment variables (see `ENV_SETUP.md`)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions.

### Database Migrations

On production, run migrations:

```bash
npx prisma migrate deploy
```

## Testing

Run backend tests:

```bash
cd backend
npm test
```

Run frontend tests:

```bash
cd frontend
npm test
```

## Project Structure

```
/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── pages/     # Page components
│   │   ├── components/ # Reusable components
│   │   ├── context/   # React context providers
│   │   └── utils/     # Utility functions
├── backend/           # Express backend
│   ├── src/
│   │   ├── routes/    # API routes
│   │   ├── services/  # Business logic
│   │   ├── middleware/ # Express middleware
│   │   └── utils/     # Utility functions
│   └── prisma/        # Prisma schema and migrations
└── docker-compose.yml # Docker services configuration
```

## Environment Variables

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed environment variable configuration for both development and production environments.

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

