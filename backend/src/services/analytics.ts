import prisma from '../utils/prisma';

interface AnalyticsData {
  totalIdeas: number;
  totalAnalyses: number;
  averageConfidence: number;
  averageOpportunityScore: number;
  categoryDistribution: Array<{ category: string; count: number }>;
  scoreDistribution: Array<{ range: string; count: number }>;
  monthlyTrend: Array<{ month: string; count: number }>;
  topKeywords: Array<{ keyword: string; count: number }>;
  marketSizeDistribution: Array<{ range: string; count: number }>;
}

/**
 * Get analytics for a user's ideas
 */
export async function getUserAnalytics(userId: string): Promise<AnalyticsData> {
  const ideas = await prisma.idea.findMany({
    where: { userId, status: 'COMPLETED' },
    include: {
      analyses: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  const analyses = ideas
    .map((idea) => idea.analyses[0])
    .filter((a): a is any => a !== null && a !== undefined);

  // Calculate averages
  const confidences = analyses
    .map((a) => a.confidenceOverall)
    .filter((c): c is number => c !== null && c !== undefined);
  const averageConfidence =
    confidences.length > 0
      ? confidences.reduce((a, b) => a + b, 0) / confidences.length
      : 0;

  const opportunityScores = analyses
    .map((a) => (a.opportunity as any)?.score)
    .filter((s): s is number => s !== null && s !== undefined);
  const averageOpportunityScore =
    opportunityScores.length > 0
      ? opportunityScores.reduce((a, b) => a + b, 0) / opportunityScores.length
      : 0;

  // Category distribution
  const categoryMap = new Map<string, number>();
  ideas.forEach((idea) => {
    const category = (idea as any).category || 'Uncategorized';
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  });
  const categoryDistribution = Array.from(categoryMap.entries()).map(
    ([category, count]) => ({ category, count })
  );

  // Score distribution
  const scoreRanges = [
    { range: '0-20', min: 0, max: 20 },
    { range: '21-40', min: 21, max: 40 },
    { range: '41-60', min: 41, max: 60 },
    { range: '61-80', min: 61, max: 80 },
    { range: '81-100', min: 81, max: 100 },
  ];
  const scoreDistribution = scoreRanges.map((range) => ({
    range: range.range,
    count: confidences.filter(
      (c) => c >= range.min && c <= range.max
    ).length,
  }));

  // Monthly trend (last 12 months)
  const monthlyMap = new Map<string, number>();
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = date.toISOString().slice(0, 7); // YYYY-MM
    monthlyMap.set(key, 0);
  }
  ideas.forEach((idea) => {
    const key = idea.createdAt.toISOString().slice(0, 7);
    if (monthlyMap.has(key)) {
      monthlyMap.set(key, (monthlyMap.get(key) || 0) + 1);
    }
  });
  const monthlyTrend = Array.from(monthlyMap.entries()).map(([month, count]) => ({
    month,
    count,
  }));

  // Top keywords
  const keywordMap = new Map<string, number>();
  analyses.forEach((analysis) => {
    const keywords = analysis.keywords || [];
    keywords.forEach((keyword: string) => {
      keywordMap.set(keyword, (keywordMap.get(keyword) || 0) + 1);
    });
  });
  const topKeywords = Array.from(keywordMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([keyword, count]) => ({ keyword, count }));

  // Market size distribution
  const marketSizeRanges = [
    { range: '<$1M', max: 1_000_000 },
    { range: '$1M-$10M', min: 1_000_000, max: 10_000_000 },
    { range: '$10M-$100M', min: 10_000_000, max: 100_000_000 },
    { range: '$100M-$1B', min: 100_000_000, max: 1_000_000_000 },
    { range: '>$1B', min: 1_000_000_000 },
  ];
  const marketSizeDistribution = marketSizeRanges.map((range) => {
    const count = analyses.filter((a) => {
      const marketSize = (a.marketSize as any)?.tamn_estimate_usd;
      if (!marketSize) return false;
      if (range.min && range.max) {
        return marketSize >= range.min && marketSize < range.max;
      }
      if (range.max) return marketSize < range.max;
      if (range.min) return marketSize >= range.min;
      return false;
    }).length;
    return { range: range.range, count };
  });

  return {
    totalIdeas: ideas.length,
    totalAnalyses: analyses.length,
    averageConfidence: Math.round(averageConfidence),
    averageOpportunityScore: Math.round(averageOpportunityScore),
    categoryDistribution,
    scoreDistribution,
    monthlyTrend,
    topKeywords,
    marketSizeDistribution,
  };
}

/**
 * Get benchmark data (aggregated across all users)
 */
export async function getBenchmarkData() {
  const allAnalyses = await prisma.analysis.findMany({
    where: {
      idea: {
        status: 'COMPLETED',
      },
    },
    take: 1000, // Sample size
  });

  const confidences = allAnalyses
    .map((a) => a.confidenceOverall)
    .filter((c): c is number => c !== null && c !== undefined);

  const opportunityScores = allAnalyses
    .map((a) => (a.opportunity as any)?.score)
    .filter((s): s is number => s !== null && s !== undefined);

  return {
    averageConfidence:
      confidences.length > 0
        ? Math.round(
            confidences.reduce((a, b) => a + b, 0) / confidences.length
          )
        : 0,
    averageOpportunityScore:
      opportunityScores.length > 0
        ? Math.round(
            opportunityScores.reduce((a, b) => a + b, 0) /
              opportunityScores.length
          )
        : 0,
    percentile50: confidences.length > 0
      ? confidences.sort((a, b) => a - b)[Math.floor(confidences.length * 0.5)]
      : 0,
    percentile75: confidences.length > 0
      ? confidences.sort((a, b) => a - b)[Math.floor(confidences.length * 0.75)]
      : 0,
    percentile90: confidences.length > 0
      ? confidences.sort((a, b) => a - b)[Math.floor(confidences.length * 0.9)]
      : 0,
  };
}

