# Gemini-Powered Startup Idea Validator - Implementation Plan

## Project Structure

```
/
├── frontend/          # React + Vite + TypeScript + MUI (Material-UI)
├── backend/           # Express + TypeScript + Prisma
├── docker-compose.yml # PostgreSQL + MinIO for local dev
├── .env.example
├── README.md
└── .gitignore
```

## Implementation Phases

### Phase 1: Project Scaffolding & Database

- Initialize frontend (Vite + React + TypeScript + Mui)
- Initialize backend (Express + TypeScript)
- Set up Prisma schema (User, Idea, Analysis, Attachment models)
- Configure docker-compose.yml (PostgreSQL + MinIO)
- Create .env.example with all required variables
- Set up basic folder structure for both frontend and backend

### Phase 2: Authentication System

- Backend: JWT-based auth with bcrypt password hashing
- Backend: Google OAuth integration using Passport.js
- Backend: Auth routes (/api/auth/register, /api/auth/login, /api/auth/google)
- Backend: Middleware for JWT verification
- Frontend: Auth context/provider
- Frontend: Login, Register, and OAuth callback pages
- Frontend: Protected route wrapper

### Phase 3: File Upload & Storage

- Backend: Multer middleware for file uploads
- Backend: S3/MinIO integration for file storage
- Backend: Attachment model and routes
- Backend: Support for images, PDFs, and URL parsing (YouTube, slide links)
- Frontend: File upload component with drag-and-drop
- Frontend: Preview for uploaded files

### Phase 4: Gemini API Integration

- Backend: Gemini API client setup
- Backend: System prompt template (expert startup analyst)
- Backend: User prompt template with structured JSON output format
- Backend: Response parsing and validation
- Backend: Error handling with exponential backoff retry
- Backend: Token usage logging
- Backend: Rate limiting middleware
- Backend: Content safety checks

### Phase 5: Idea Submission & Analysis

- Backend: POST /api/ideas endpoint
- Backend: POST /api/ideas/:id/generate endpoint (triggers Gemini analysis)
- Backend: Analysis generation service
- Backend: Store raw Gemini output in database
- Frontend: Idea submission form (title, one-liner, description, attachments)
- Frontend: Progress UI during analysis generation
- Frontend: Results page with structured sections:
  - Executive summary
  - Market size & trends
  - Top competitors (3-7) with links
  - SWOT grid
  - Technical feasibility
  - Cost estimate
  - 3-step roadmap
  - Next steps & investor pitch
  - Confidence scores

### Phase 6: Results UI & Regeneration

- Frontend: AnalysisCard component for each section
- Frontend: SWOTGrid component
- Frontend: RoadmapTimeline component
- Frontend: "Regenerate section" functionality
- Frontend: "Copy to clipboard" buttons
- Frontend: Expandable raw output panel
- Backend: POST /api/ideas/:id/regenerate-section endpoint

### Phase 7: PDF Export

- Backend: GET /api/export/:id/pdf endpoint
- Backend: Puppeteer-based PDF generation
- Backend: PDF template with all analysis sections
- Frontend: PDF download button
- Frontend: PDF preview option

### Phase 8: History & Dashboard

- Backend: GET /api/ideas endpoint (user's ideas)
- Backend: GET /api/ideas/:id endpoint
- Frontend: History dashboard page
- Frontend: Idea list with search/filter
- Frontend: Quick view of past analyses

### Phase 9: Admin Dashboard

- Backend: Admin role check middleware
- Backend: GET /api/admin/usage endpoint
- Backend: Usage statistics aggregation
- Frontend: Admin dashboard page
- Frontend: UsageChart component
- Frontend: User activity metrics

### Phase 10: Landing Page & UI Polish

- Frontend: Landing page with pitch & CTA
- Frontend: Responsive design (mobile + desktop)
- Frontend: Accessibility improvements (labels, contrast)
- Frontend: Loading states and error handling
- Frontend: Toast notifications

### Phase 11: Security & Rate Limiting

- Backend: Rate limiting per user/IP
- Backend: Monthly credit system
- Backend: Input validation and sanitization
- Backend: URL validation (HEAD request check)
- Backend: GDPR delete account flow
- Backend: Encrypted sensitive data storage

### Phase 12: Testing

- Backend: Unit tests for Gemini integration
- Backend: Unit tests for auth routes
- Backend: Integration tests for idea submission flow
- Frontend: Component tests with React Testing Library
- E2E test: Full flow (register → login → create idea → see analysis → export PDF)
- Test attachment handling
- Test rate limiting
- Test regenerate section

### Phase 13: Deployment Configuration

- Vercel configuration for frontend
- Render/Heroku configuration for backend
- Environment variable documentation
- Docker production setup
- Database migration strategy

### Phase 14: Documentation & Seeding

- Comprehensive README with setup instructions
- API documentation
- Environment variable guide
- Seeded sample ideas and admin demo account
- Deployment guide

## Key Files to Create

**Backend:**

- `backend/src/index.ts` - Express server setup
- `backend/src/routes/auth.ts` - Authentication routes
- `backend/src/routes/ideas.ts` - Idea CRUD routes
- `backend/src/routes/admin.ts` - Admin routes
- `backend/src/services/gemini.ts` - Gemini API client
- `backend/src/services/analysis.ts` - Analysis generation logic
- `backend/src/services/pdf.ts` - PDF generation
- `backend/src/middleware/auth.ts` - JWT middleware
- `backend/src/middleware/rateLimit.ts` - Rate limiting
- `backend/src/entities/` - TypeORM entity files (User, Idea, Analysis, Attachment)
- `backend/src/data-source.ts` - TypeORM data source configuration
- `backend/.env.example` - Environment template

**Frontend:**

- `frontend/src/App.tsx` - Main app with routing
- `frontend/src/pages/Landing.tsx` - Landing page
- `frontend/src/pages/Login.tsx` - Login page
- `frontend/src/pages/Register.tsx` - Register page
- `frontend/src/pages/IdeaForm.tsx` - Idea submission form
- `frontend/src/pages/Results.tsx` - Analysis results page
- `frontend/src/pages/History.tsx` - History dashboard
- `frontend/src/pages/Admin.tsx` - Admin dashboard
- `frontend/src/components/AnalysisCard.tsx` - Analysis section card
- `frontend/src/components/SWOTGrid.tsx` - SWOT visualization
- `frontend/src/components/RoadmapTimeline.tsx` - Roadmap component
- `frontend/src/components/PDFExporter.tsx` - PDF export button
- `frontend/src/context/AuthContext.tsx` - Auth state management

## Technical Decisions

1. **OAuth**: Passport.js with Google OAuth 2.0 strategy
2. **File Storage**: MinIO for local dev, S3-compatible for production
3. **PDF Generation**: Puppeteer for flexible HTML-to-PDF conversion
4. **Deployment**: Vercel (frontend) + Render (backend) as primary option
5. **Rate Limiting**: express-rate-limit with Redis option for production
6. **Validation**: Zod for request validation
7. **Error Handling**: Centralized error middleware

## Gemini Prompt Structure

System prompt emphasizes structured JSON output with confidence scores and assumption labeling. User prompt includes title, one-liner, description, and attachment summaries. Response parsing validates JSON structure and handles partial responses gracefully.