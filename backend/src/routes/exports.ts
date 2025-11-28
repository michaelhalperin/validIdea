import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  exportToNotion,
  exportToCSV,
  exportToJSON,
  exportToGoogleSheets,
  exportToAirtable,
} from '../services/exports';

const router = express.Router();

// GET /api/exports/:analysisId/notion - Export to Notion (Markdown)
router.get('/:analysisId/notion', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { analysisId } = req.params;

    const markdown = await exportToNotion(analysisId, userId);
    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename="analysis-${analysisId}.md"`);
    res.send(markdown);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/exports/:analysisId/csv - Export to CSV
router.get('/:analysisId/csv', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { analysisId } = req.params;

    const csv = await exportToCSV(analysisId, userId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="analysis-${analysisId}.csv"`);
    res.send(csv);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/exports/:analysisId/json - Export to JSON
router.get('/:analysisId/json', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { analysisId } = req.params;

    const json = await exportToJSON(analysisId, userId);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="analysis-${analysisId}.json"`);
    res.json(json);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/exports/:analysisId/google-sheets - Export to Google Sheets
router.get('/:analysisId/google-sheets', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { analysisId } = req.params;

    const csv = await exportToGoogleSheets(analysisId, userId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="analysis-${analysisId}.csv"`);
    res.send(csv);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/exports/:analysisId/airtable - Export to Airtable
router.get('/:analysisId/airtable', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { analysisId } = req.params;

    const csv = await exportToAirtable(analysisId, userId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="analysis-${analysisId}.csv"`);
    res.send(csv);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

