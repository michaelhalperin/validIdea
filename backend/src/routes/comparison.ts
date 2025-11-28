import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getComparison,
  saveComparison,
  getUserComparisons,
  deleteComparison,
} from '../services/comparison';
import { z } from 'zod';

const router = express.Router();

const comparisonSchema = z.object({
  ideaIds: z.array(z.string()).min(2).max(5),
  name: z.string().optional(),
});

// GET /api/comparison - Get user's saved comparisons
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const comparisons = await getUserComparisons(userId);
    res.json({ comparisons });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/comparison - Compare ideas
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { ideaIds, name } = comparisonSchema.parse(req.body);

    const comparison = await getComparison(ideaIds, userId);
    const saved = name ? await saveComparison(userId, ideaIds, name) : null;

    res.json({ comparison, saved });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
      return;
    }
    res.status(500).json({ error: error.message });
  }
});

// GET /api/comparison/:id - Get specific comparison
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const comparison = await (require('../utils/prisma').default as any).comparison.findUnique({
      where: { id: req.params.id },
    });

    if (!comparison || comparison.userId !== userId) {
      return res.status(404).json({ error: 'Comparison not found' });
    }

    const data = await getComparison(comparison.ideaIds, userId);
    res.json({ comparison: data, saved: comparison });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/comparison/:id - Delete comparison
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    await deleteComparison(req.params.id, userId);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

