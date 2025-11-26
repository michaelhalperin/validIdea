import express from 'express';
import prisma from '../utils/prisma';
import { authenticateToken } from '../middleware/auth';
import { generatePDF } from '../services/pdf';

const router = express.Router();

// GET /api/export/:id/pdf - Export analysis as PDF
router.get('/:id/pdf', authenticateToken, async (req, res) => {
  try {
    const user = (req as any).user;
    const analysis = await prisma.analysis.findUnique({
      where: { id: req.params.id },
      include: {
        idea: true,
      },
    });

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    // Verify user owns this analysis
    if (analysis.userId !== user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const pdfBuffer = await generatePDF(req.params.id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="analysis-${analysis.idea.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${req.params.id}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

export default router;

