import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { generateInvestorReportForIdea, getInvestorReportForIdea } from '../services/investorReports';

const router = express.Router();

// GET /api/investor-reports/:ideaId - Get saved investor report
router.get('/:ideaId', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { ideaId } = req.params;

    const report = await getInvestorReportForIdea(ideaId, userId);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json({ report });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/investor-reports/:ideaId - Generate investor report
router.post('/:ideaId', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { ideaId } = req.params;

    const report = await generateInvestorReportForIdea(ideaId, userId);
    res.json({ report });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

