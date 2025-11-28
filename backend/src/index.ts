import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import prisma from './utils/prisma';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Passport
app.use(passport.initialize());

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow any localhost port
    if (process.env.NODE_ENV === 'development' && origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    // Get allowed origins from environment (comma-separated) or use defaults
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',').map(url => url.trim())
      : [
          process.env.FRONTEND_URL || 'http://localhost:5174',
          'https://valid-idea.vercel.app',
          'http://localhost:5174'
        ];
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
import authRoutes from './routes/auth';
import ideaRoutes from './routes/ideas';
import adminRoutes from './routes/admin';
import exportRoutes from './routes/export';
import contactRoutes from './routes/contact';
import ideaOfTheDayRoutes from './routes/ideaOfTheDay';
import comparisonRoutes from './routes/comparison';
import recommendationsRoutes from './routes/recommendations';
import analyticsRoutes from './routes/analytics';
import chatRoutes from './routes/chat';
import investorReportsRoutes from './routes/investorReports';
import marketAlertsRoutes from './routes/marketAlerts';
import validationChecklistRoutes from './routes/validationChecklist';
import exportsRoutes from './routes/exports';
import { pregenerateTodayIdea } from './services/ideaOfTheDay';
import { checkMarketAlerts } from './services/marketAlerts';

app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/export', exportRoutes);
app.use('/api', contactRoutes);
app.use('/api/idea-of-the-day', ideaOfTheDayRoutes);
app.use('/api/comparison', comparisonRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/investor-reports', investorReportsRoutes);
app.use('/api/market-alerts', marketAlertsRoutes);
app.use('/api/validation-checklist', validationChecklistRoutes);
app.use('/api/exports', exportsRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Pre-generate today's idea of the day in background (non-blocking)
  pregenerateTodayIdea().catch((error) => {
    console.error('[Startup] Failed to pre-generate idea of the day:', error);
  });

  // Check market alerts every hour
  setInterval(() => {
    checkMarketAlerts().catch((error) => {
      console.error('[MarketAlerts] Error checking alerts:', error);
    });
  }, 60 * 60 * 1000); // Every hour
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

