import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { getChatHistory, sendChatMessage } from '../services/chat';
import { z } from 'zod';

const router = express.Router();

const messageSchema = z.object({
  message: z.string().min(1).max(2000),
});

// GET /api/chat/:analysisId - Get chat history
router.get('/:analysisId', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { analysisId } = req.params;

    const history = await getChatHistory(analysisId, userId);
    res.json({ messages: history });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/chat/:analysisId - Send chat message
router.post('/:analysisId', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { analysisId } = req.params;
    const { message } = messageSchema.parse(req.body);

    const result = await sendChatMessage(analysisId, userId, message);
    res.json({ messages: [result.userMessage, result.assistantMessage] });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
      return;
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;

