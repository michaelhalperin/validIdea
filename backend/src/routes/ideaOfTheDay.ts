import express from 'express';
import { getTodayIdeaOfTheDay, getIdeaOfTheDay, isGenerating } from '../services/ideaOfTheDay';
import prisma from '../utils/prisma';

const router = express.Router();

// GET /api/idea-of-the-day - Get today's idea of the day
router.get('/', async (req, res) => {
  try {
    console.log('[IdeaOfTheDay] Request received for today\'s idea');
    const ideaOfTheDay = await getTodayIdeaOfTheDay();
    
    // If null, it means generation is in progress
    if (!ideaOfTheDay) {
      const generating = isGenerating();
      return res.status(202).json({ 
        status: 'generating',
        message: generating 
          ? 'Idea of the day is being generated. Please check back in a minute.'
          : 'Idea of the day generation started. Please check back in a minute.'
      });
    }
    
    console.log('[IdeaOfTheDay] Response ready');

    res.json({
      ideaOfTheDay: {
        id: ideaOfTheDay.id,
        date: ideaOfTheDay.date,
        title: ideaOfTheDay.title,
        oneLiner: ideaOfTheDay.oneLiner,
        description: ideaOfTheDay.description,
        idea: {
          id: ideaOfTheDay.idea.id,
          title: ideaOfTheDay.idea.title,
          oneLiner: ideaOfTheDay.idea.oneLiner,
          description: ideaOfTheDay.idea.description,
          attachments: ideaOfTheDay.idea.attachments,
        },
        analysis: ideaOfTheDay.analysis,
      },
    });
  } catch (error: any) {
    console.error('[IdeaOfTheDay] Error:', error);
    console.error('[IdeaOfTheDay] Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch idea of the day',
      message: error.message 
    });
  }
});

// GET /api/idea-of-the-day/:id - Get specific idea of the day by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const ideaOfTheDay = await (prisma as any).ideaOfTheDay.findUnique({
      where: { id },
      include: {
        idea: {
          include: {
            attachments: true,
          },
        },
        analysis: true,
      },
    });
    
    if (!ideaOfTheDay) {
      return res.status(404).json({ error: 'Idea of the day not found' });
    }

    res.json({
      ideaOfTheDay: {
        id: ideaOfTheDay.id,
        date: ideaOfTheDay.date,
        title: ideaOfTheDay.title,
        oneLiner: ideaOfTheDay.oneLiner,
        description: ideaOfTheDay.description,
        idea: {
          id: ideaOfTheDay.idea.id,
          title: ideaOfTheDay.idea.title,
          oneLiner: ideaOfTheDay.idea.oneLiner,
          description: ideaOfTheDay.idea.description,
          attachments: ideaOfTheDay.idea.attachments,
        },
        analysis: ideaOfTheDay.analysis,
      },
    });
  } catch (error: any) {
    console.error('Error fetching idea of the day:', error);
    res.status(500).json({ error: 'Failed to fetch idea of the day' });
  }
});

export default router;

