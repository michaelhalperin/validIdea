import prisma from '../utils/prisma';
import type { Analysis } from '@prisma/client';

interface ComparisonData {
  ideas: Array<{
    id: string;
    title: string;
    oneLiner: string;
    analysis: Analysis | null;
  }>;
}

/**
 * Get comparison data for multiple ideas
 */
export async function getComparison(ideaIds: string[], userId: string): Promise<ComparisonData> {
  // Verify all ideas belong to the user
  const ideas = await prisma.idea.findMany({
    where: {
      id: { in: ideaIds },
      userId,
    },
    include: {
      analyses: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  if (ideas.length !== ideaIds.length) {
    throw new Error('Some ideas not found or access denied');
  }

  return {
    ideas: ideas.map((idea) => ({
      id: idea.id,
      title: idea.title,
      oneLiner: idea.oneLiner,
      analysis: idea.analyses[0] || null,
    })),
  };
}

/**
 * Save a comparison
 */
export async function saveComparison(
  userId: string,
  ideaIds: string[],
  name?: string
) {
  return (prisma as any).comparison.create({
    data: {
      userId,
      ideaIds,
      name,
    },
  });
}

/**
 * Get user's saved comparisons
 */
export async function getUserComparisons(userId: string) {
  return (prisma as any).comparison.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Delete a comparison
 */
export async function deleteComparison(comparisonId: string, userId: string) {
  const comparison = await (prisma as any).comparison.findUnique({
    where: { id: comparisonId },
  });

  if (!comparison || comparison.userId !== userId) {
    throw new Error('Comparison not found or access denied');
  }

  return (prisma as any).comparison.delete({
    where: { id: comparisonId },
  });
}

