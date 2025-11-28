import prisma from '../utils/prisma';

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'problem' | 'solution' | 'market' | 'business' | 'execution';
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  resources?: Array<{ title: string; url: string }>;
}

/**
 * Generate validation checklist for an idea
 */
export async function generateValidationChecklist(
  ideaId: string,
  userId: string
): Promise<ChecklistItem[]> {
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
    throw new Error('Idea or analysis not found');
  }

  // Load saved completion status
  const savedItems = await (prisma as any).checklistItem.findMany({
    where: { ideaId, userId },
  });
  const completionMap = new Map<string, boolean>(
    savedItems.map((item: any) => [item.itemId, Boolean(item.completed)])
  );

  const analysis = idea.analyses[0] as any;
  const checklist: ChecklistItem[] = [];

  // Problem Validation
  checklist.push({
    id: 'problem-1',
    title: 'Validate Problem Exists',
    description:
      'Confirm that the problem you are solving is real and painful for your target audience',
    category: 'problem',
    completed: completionMap.get('problem-1') ?? false,
    priority: 'high',
    resources: [
      {
        title: 'How to Validate a Problem',
        url: 'https://www.ycombinator.com/library/4D-how-to-validate-a-problem',
      },
    ],
  });

  checklist.push({
    id: 'problem-2',
    title: 'Interview 10+ Potential Users',
    description: 'Conduct user interviews to understand pain points and validate problem-solution fit',
    category: 'problem',
    completed: completionMap.get('problem-2') || false,
    priority: 'high',
  });

  // Solution Validation
  checklist.push({
    id: 'solution-1',
    title: 'Build MVP',
    description: 'Create a minimum viable product that solves the core problem',
    category: 'solution',
    completed: completionMap.get('solution-1') || false,
    priority: 'high',
  });

  checklist.push({
    id: 'solution-2',
    title: 'Get First Paying Customer',
    description: 'Validate willingness to pay by getting at least one paying customer',
    category: 'solution',
    completed: completionMap.get('solution-2') || false,
    priority: 'high',
  });

  // Market Validation
  const marketSize = (analysis.marketSize as any)?.tamn_estimate_usd;
  if (marketSize && marketSize < 10_000_000) {
    checklist.push({
      id: 'market-1',
      title: 'Reassess Market Size',
      description: 'Market size appears limited. Consider expanding target market or pivoting',
      category: 'market',
      completed: completionMap.get('market-1') || false,
      priority: 'high',
    });
  }

  checklist.push({
    id: 'market-2',
    title: 'Analyze Competitors',
    description: 'Deep dive into competitor offerings and identify differentiation opportunities',
    category: 'market',
    completed: completionMap.get('market-2') || false,
    priority: 'medium',
  });

  // Business Validation
  const opportunityScore = (analysis.opportunity as any)?.score;
  if (opportunityScore && opportunityScore < 60) {
    checklist.push({
      id: 'business-1',
      title: 'Improve Opportunity Score',
      description: 'Focus on increasing market demand or improving feasibility',
      category: 'business',
      completed: completionMap.get('business-1') || false,
      priority: 'high',
    });
  }

  checklist.push({
    id: 'business-2',
    title: 'Define Revenue Model',
    description: 'Clearly define how you will monetize and validate pricing',
    category: 'business',
    completed: completionMap.get('business-2') || false,
    priority: 'high',
  });

  checklist.push({
    id: 'business-3',
    title: 'Calculate Unit Economics',
    description: 'Ensure positive unit economics (LTV > CAC)',
    category: 'business',
    completed: completionMap.get('business-3') || false,
    priority: 'high',
  });

  // Execution Validation
  const techFeasibility = analysis.technicalFeasibility || {};
  if (techFeasibility.complexity_rating && techFeasibility.complexity_rating > 7) {
    checklist.push({
      id: 'execution-1',
      title: 'Simplify Technical Approach',
      description: 'Reduce technical complexity to accelerate development',
      category: 'execution',
      completed: completionMap.get('execution-1') || false,
      priority: 'medium',
    });
  }

  checklist.push({
    id: 'execution-2',
    title: 'Build Go-to-Market Strategy',
    description: 'Define clear channels and tactics for acquiring customers',
    category: 'execution',
    completed: completionMap.get('execution-2') || false,
    priority: 'medium',
  });

  checklist.push({
    id: 'execution-3',
    title: 'Secure Key Partnerships',
    description: 'Identify and establish partnerships that can accelerate growth',
    category: 'execution',
    completed: completionMap.get('execution-3') || false,
    priority: 'low',
  });

  // Add custom items based on analysis weaknesses
  const swot = analysis.swot || {};
  const weaknesses = swot.weaknesses || [];
  if (weaknesses.length > 0) {
    checklist.push({
      id: 'custom-1',
      title: 'Address Key Weaknesses',
      description: `Focus on: ${weaknesses.slice(0, 2).join(', ')}`,
      category: 'execution',
      completed: completionMap.get('custom-1') || false,
      priority: 'high',
    });
  }

  return checklist;
}

/**
 * Mark checklist item as completed
 */
export async function updateChecklistItem(
  ideaId: string,
  userId: string,
  itemId: string,
  completed: boolean
) {
  // Verify the idea belongs to the user
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, userId },
  });

  if (!idea) {
    throw new Error('Idea not found or access denied');
  }

  // Upsert the checklist item
  await (prisma as any).checklistItem.upsert({
    where: {
      ideaId_userId_itemId: {
        ideaId,
        userId,
        itemId,
      },
    },
    update: {
      completed,
      completedAt: completed ? new Date() : null,
    },
    create: {
      ideaId,
      userId,
      itemId,
      completed,
      completedAt: completed ? new Date() : null,
    },
  });

  return { success: true };
}

