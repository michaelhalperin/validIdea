import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createMarketAlert,
  getUserMarketAlerts,
  updateMarketAlert,
  deleteMarketAlert,
} from '../services/marketAlerts';
import { z } from 'zod';

const router = express.Router();

const createAlertSchema = z.object({
  ideaId: z.string().optional(),
  alertType: z.enum(['COMPETITOR_LAUNCH', 'MARKET_SIZE_CHANGE', 'SIMILAR_IDEA_LAUNCH', 'INDUSTRY_NEWS', 'CUSTOM']),
  keywords: z.array(z.string()).optional(),
  competitorNames: z.array(z.string()).optional(),
});

const updateAlertSchema = z.object({
  isActive: z.boolean().optional(),
  keywords: z.array(z.string()).optional(),
  competitorNames: z.array(z.string()).optional(),
});

// GET /api/market-alerts - Get user's market alerts
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const alerts = await getUserMarketAlerts(userId);
    res.json({ alerts });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/market-alerts - Create market alert
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const data = createAlertSchema.parse(req.body);

    const alert = await createMarketAlert(userId, data);
    res.json({ alert });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
      return;
    }
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/market-alerts/:id - Update market alert
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const data = updateAlertSchema.parse(req.body);

    const alert = await updateMarketAlert(id, userId, data);
    res.json({ alert });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
      return;
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/market-alerts/:id - Delete market alert
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    await deleteMarketAlert(req.params.id, userId);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

