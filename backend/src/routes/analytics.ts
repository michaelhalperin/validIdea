import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { getUserAnalytics, getBenchmarkData } from '../services/analytics';

const router = express.Router();

// GET /api/analytics - Get user analytics
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const analytics = await getUserAnalytics(userId);
    res.json({ analytics });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/analytics/benchmark - Get benchmark data
router.get('/benchmark', authenticateToken, async (req, res) => {
  try {
    const benchmark = await getBenchmarkData();
    res.json({ benchmark });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

