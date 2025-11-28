import prisma from '../utils/prisma';
import type { Analysis } from '@prisma/client';

interface SimilarIdea {
  ideaId: string;
  title: string;
  similarityScore: number;
  reason: string;
}

/**
 * Find similar ideas based on keywords, category, and market
 */
export async function findSimilarIdeas(
  ideaId: string,
  userId: string,
  limit: number = 5
): Promise<SimilarIdea[]> {
  const currentIdea = await prisma.idea.findUnique({
    where: { id: ideaId, userId },
    include: {
      analyses: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!currentIdea || !currentIdea.analyses[0]) {
    return [];
  }

  const analysis = (currentIdea as any).analyses[0] as any;
  const keywords = analysis.keywords || [];
  const categorization = analysis.categorization || {};
  const category = categorization.type || (currentIdea as any).category || '';

  // Find ideas with similar keywords or category
  const similarIdeas = await (prisma as any).idea.findMany({
    where: {
      userId,
      id: { not: ideaId },
      status: 'COMPLETED',
      OR: [
        { category: category ? { equals: category } : undefined },
        { tags: { hasSome: keywords.slice(0, 3) } },
      ],
    },
    include: {
      analyses: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    take: limit * 2, // Get more to calculate similarity
  });

  // Calculate similarity scores
  const scored = (similarIdeas as any[])
    .map((idea) => {
      const ideaAnalysis = (idea as any).analyses[0] as any;
      if (!ideaAnalysis) return null;

      let score = 0;
      const reasons: string[] = [];

      // Keyword overlap
      const ideaKeywords = ideaAnalysis.keywords || [];
      const commonKeywords = keywords.filter((k: string) =>
        ideaKeywords.includes(k)
      );
      score += commonKeywords.length * 10;
      if (commonKeywords.length > 0) {
        reasons.push(`Shares ${commonKeywords.length} keywords`);
      }

      // Category match
      const ideaCategory =
        ideaAnalysis.categorization?.type || (idea as any).category;
      if (ideaCategory === category && category) {
        score += 20;
        reasons.push('Same category');
      }

      // Market similarity
      const currentMarket = categorization.market || '';
      const ideaMarket = ideaAnalysis.categorization?.market || '';
      if (currentMarket && ideaMarket && currentMarket === ideaMarket) {
        score += 15;
        reasons.push('Same target market');
      }

      return {
        ideaId: idea.id,
        title: idea.title,
        similarityScore: score,
        reason: reasons.join(', ') || 'Similar characteristics',
      };
    })
    .filter((item): item is SimilarIdea => item !== null)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);

  return scored;
}

/**
 * Get improvement suggestions for an idea
 */
export async function getImprovementSuggestions(
  ideaId: string,
  userId: string
): Promise<string[]> {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, userId },
    include: {
      analyses: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!idea || !idea.analyses[0]) {
    return [];
  }

  const analysis = idea.analyses[0] as any;
  const suggestions: string[] = [];

  // Low confidence score
  if (analysis.confidenceOverall && analysis.confidenceOverall < 60) {
    suggestions.push(
      'Consider refining your value proposition to increase market confidence'
    );
  }

  // Weak SWOT
  const swot = analysis.swot || {};
  if (swot.weaknesses && swot.weaknesses.length > swot.strengths?.length) {
    suggestions.push(
      'Focus on developing more competitive advantages to balance your weaknesses'
    );
  }

  // High complexity
  const techFeasibility = analysis.technicalFeasibility || {};
  if (techFeasibility.complexity_rating && techFeasibility.complexity_rating > 7) {
    suggestions.push(
      'Consider simplifying your technical approach to reduce development complexity'
    );
  }

  // Low opportunity score
  const opportunity = analysis.opportunity || {};
  if (opportunity.score && opportunity.score < 50) {
    suggestions.push(
      'Explore ways to increase market demand or improve feasibility'
    );
  }

  // Missing market signals
  const signals = analysis.signals || {};
  if (!signals.community_engagement && !signals.search_trends) {
    suggestions.push(
      'Build community engagement and validate search interest before launching'
    );
  }

  return suggestions;
}

