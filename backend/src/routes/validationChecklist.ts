import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  generateValidationChecklist,
  updateChecklistItem,
} from '../services/validationChecklist';

const router = express.Router();

// GET /api/validation-checklist/:ideaId - Get validation checklist
router.get('/:ideaId', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { ideaId } = req.params;

    const checklist = await generateValidationChecklist(ideaId, userId);
    res.json({ checklist });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/validation-checklist/:ideaId/:itemId - Update checklist item
router.patch('/:ideaId/:itemId', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { ideaId, itemId } = req.params;
    const { completed } = req.body;

    await updateChecklistItem(ideaId, userId, itemId, completed);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

