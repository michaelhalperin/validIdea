import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  findSimilarIdeas,
  getImprovementSuggestions,
} from '../services/recommendations';

const router = express.Router();

// GET /api/recommendations/similar/:ideaId - Get similar ideas
router.get('/similar/:ideaId', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { ideaId } = req.params;
    const limit = parseInt(req.query.limit as string) || 5;

    const similar = await findSimilarIdeas(ideaId, userId, limit);
    res.json({ similarIdeas: similar });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/recommendations/improvements/:ideaId - Get improvement suggestions
router.get('/improvements/:ideaId', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { ideaId } = req.params;

    const suggestions = await getImprovementSuggestions(ideaId, userId);
    res.json({ suggestions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

