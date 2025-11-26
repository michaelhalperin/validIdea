import express from 'express';
import prisma from '../utils/prisma';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/admin/usage - Get usage statistics
router.get('/usage', async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Total users
    const totalUsers = await prisma.user.count();

    // Active users (last 30 days)
    const activeUsers = await prisma.user.count({
      where: {
        updatedAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Total ideas
    const totalIdeas = await prisma.idea.count();

    // Total analyses
    const totalAnalyses = await prisma.analysis.count();

    // Total token usage
    const tokenUsageResult = await prisma.analysis.aggregate({
      _sum: {
        tokenUsage: true,
      },
    });

    // Ideas by status
    const ideasByStatus = await prisma.idea.groupBy({
      by: ['status'],
      _count: true,
    });

    // Analyses by month (last 6 months)
    const analysesByMonth = await prisma.analysis.groupBy({
      by: ['createdAt'],
      _count: true,
      where: {
        createdAt: {
          gte: new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // Users by credits used
    const usersByCredits = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        credits: true,
        creditsUsed: true,
      },
      orderBy: {
        creditsUsed: 'desc',
      },
      take: 10,
    });

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        totalIdeas,
        totalAnalyses,
        totalTokenUsage: tokenUsageResult._sum.tokenUsage || 0,
      },
      ideasByStatus: ideasByStatus.map((item) => ({
        status: item.status,
        count: item._count,
      })),
      topUsersByCredits: usersByCredits,
      analysesByMonth: analysesByMonth.map((item) => ({
        month: item.createdAt.toISOString().substring(0, 7),
        count: item._count,
      })),
    });
  } catch (error) {
    console.error('Get usage stats error:', error);
    res.status(500).json({ error: 'Failed to get usage statistics' });
  }
});

// GET /api/admin/users - Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        credits: true,
        creditsUsed: true,
        createdAt: true,
        _count: {
          select: {
            ideas: true,
            analyses: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

export default router;

