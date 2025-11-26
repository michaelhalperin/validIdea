import express from 'express';
import multer from 'multer';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { authenticateToken } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimit';
import { createIdea, generateIdeaAnalysis, regenerateAnalysisSection } from '../services/analysis';
import { uploadFile } from '../services/storage';
import { validateUrl, isYouTubeUrl, isSlideUrl } from '../utils/urlValidator';
import { AttachmentType } from '@prisma/client';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Create idea schema
const createIdeaSchema = z.object({
  title: z.string().min(1).max(200),
  oneLiner: z.string().min(1).max(500),
  description: z.string().min(10),
  attachmentUrls: z.array(z.string().url()).optional(),
});

// POST /api/ideas - Create a new idea
router.post('/', authenticateToken, apiLimiter, async (req, res) => {
  try {
    const validatedData = createIdeaSchema.parse(req.body);
    const { title, oneLiner, description, attachmentUrls } = validatedData;
    const user = (req as any).user;

    const attachments: any[] = [];

    // Process URL attachments
    if (attachmentUrls) {
      for (const url of attachmentUrls) {
        const isValid = await validateUrl(url);
        if (!isValid) {
          return res.status(400).json({ error: `Invalid URL: ${url}` });
        }

        let type: AttachmentType = 'OTHER';
        if (isYouTubeUrl(url)) {
          type = 'VIDEO_LINK';
        } else if (isSlideUrl(url)) {
          type = 'SLIDE_LINK';
        }

        attachments.push({
          type,
          url,
        });
      }
    }

    const idea = await createIdea({
      title,
      oneLiner,
      description,
      userId: user.id,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    res.status(201).json({ idea });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error('Create idea error:', error);
    res.status(500).json({ error: 'Failed to create idea' });
  }
});

// POST /api/ideas/:id/attachments - Upload file attachment
router.post(
  '/:id/attachments',
  authenticateToken,
  apiLimiter,
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }
      const user = (req as any).user;

      const idea = await prisma.idea.findUnique({
        where: { id: req.params.id },
      });

      if (!idea) {
        return res.status(404).json({ error: 'Idea not found' });
      }

      if (idea.userId !== user.id) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const key = await uploadFile(req.file, `ideas/${idea.id}`);

      let type: AttachmentType = 'OTHER';
      if (req.file.mimetype.startsWith('image/')) {
        type = 'IMAGE';
      } else if (req.file.mimetype === 'application/pdf') {
        type = 'PDF';
      }

      const attachment = await prisma.attachment.create({
        data: {
          ideaId: idea.id,
          type,
          url: key, // In production, this would be a full URL
          fileName: req.file.originalname,
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
        },
      });

      res.status(201).json({ attachment });
    } catch (error) {
      console.error('Upload attachment error:', error);
      res.status(500).json({ error: 'Failed to upload attachment' });
    }
  }
);

// POST /api/ideas/:id/generate - Generate analysis
router.post('/:id/generate', authenticateToken, apiLimiter, async (req, res) => {
  try {
    const user = (req as any).user;
    
    // Verify ownership first
    const idea = await prisma.idea.findUnique({
      where: { id: req.params.id }
    });
    
    if (!idea) return res.status(404).json({ error: 'Idea not found' });
    if (idea.userId !== user.id) return res.status(403).json({ error: 'Unauthorized' });

    const analysis = await generateIdeaAnalysis(req.params.id, user.id);
    res.json({ analysis });
  } catch (error: any) {
    console.error('Generate analysis error:', error);
    if (error.message === 'Monthly credit limit reached') {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to generate analysis' });
  }
});

// POST /api/ideas/:id/regenerate-section - Regenerate a specific section
router.post(
  '/:id/regenerate-section',
  authenticateToken,
  apiLimiter,
  async (req, res) => {
    try {
      const { section } = req.body;
      if (!section) {
        return res.status(400).json({ error: 'Section is required' });
      }
      const user = (req as any).user;

      // Verify ownership
      const idea = await prisma.idea.findUnique({
        where: { id: req.params.id }
      });
      
      if (!idea) return res.status(404).json({ error: 'Idea not found' });
      if (idea.userId !== user.id) return res.status(403).json({ error: 'Unauthorized' });

      const analysis = await regenerateAnalysisSection(
        req.params.id,
        user.id,
        section
      );
      res.json({ analysis });
    } catch (error: any) {
      console.error('Regenerate section error:', error);
      res.status(500).json({ error: 'Failed to regenerate section' });
    }
  }
);

// GET /api/ideas - Get user's ideas
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = (req as any).user;
    const ideas = await prisma.idea.findMany({
      where: { userId: user.id },
      include: {
        attachments: true,
        analyses: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ ideas });
  } catch (error) {
    console.error('Get ideas error:', error);
    res.status(500).json({ error: 'Failed to get ideas' });
  }
});

// GET /api/ideas/:id - Get a specific idea
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const user = (req as any).user;
    const idea = await prisma.idea.findUnique({
      where: { id: req.params.id },
      include: {
        attachments: true,
        analyses: {
          orderBy: { createdAt: 'desc' },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    // Only allow owner to see it (or maybe public if we add sharing later)
    if (idea.userId !== user.id) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({ idea });
  } catch (error) {
    console.error('Get idea error:', error);
    res.status(500).json({ error: 'Failed to get idea' });
  }
});

// DELETE /api/ideas/:id - Delete a specific idea
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const user = (req as any).user;
    
    // Verify ownership
    const idea = await prisma.idea.findUnique({
      where: { id: req.params.id },
    });

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    if (idea.userId !== user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.idea.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Idea deleted successfully' });
  } catch (error) {
    console.error('Delete idea error:', error);
    res.status(500).json({ error: 'Failed to delete idea' });
  }
});

export default router;
