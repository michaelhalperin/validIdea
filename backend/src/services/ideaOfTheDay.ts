import prisma from '../utils/prisma';
import { generateIdeaAnalysis } from './analysis';

// Track ongoing generations to avoid duplicates
const generatingIdeas = new Set<string>();

/**
 * Get or create the idea of the day for a specific date
 * Returns null if still generating (caller should check status)
 */
export async function getIdeaOfTheDay(date?: Date) {
  const targetDate = date || new Date();
  // Set to start of day for consistent date comparison
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);
  const dateKey = startOfDay.toISOString().split('T')[0];

  // Check if idea of the day exists for this date
  let ideaOfTheDay = await (prisma as any).ideaOfTheDay.findFirst({
    where: {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      idea: {
        include: {
          attachments: true,
        },
      },
      analysis: true,
    },
  });

  // If no idea exists and not already generating, start background generation
  if (!ideaOfTheDay && !generatingIdeas.has(dateKey)) {
    generatingIdeas.add(dateKey);
    // Generate in background (don't await)
    generateNewIdeaOfTheDay(targetDate).catch((error) => {
      console.error('[IdeaOfTheDay] Background generation failed:', error);
      generatingIdeas.delete(dateKey);
    }).finally(() => {
      generatingIdeas.delete(dateKey);
    });
    // Return null to indicate it's generating
    return null;
  }

  return ideaOfTheDay;
}

/**
 * Check if idea is currently being generated
 */
export function isGenerating(date?: Date): boolean {
  const targetDate = date || new Date();
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const dateKey = startOfDay.toISOString().split('T')[0];
  return generatingIdeas.has(dateKey);
}

/**
 * Generate a new idea of the day using AI
 */
async function generateNewIdeaOfTheDay(date: Date): Promise<any> {
  console.log('[IdeaOfTheDay] Starting generation for date:', date);
  
  // Get or create a system user for idea of the day
  let systemUser = await prisma.user.findUnique({
    where: { email: 'system@ideavalidate.com' },
  });

  if (!systemUser) {
    console.log('[IdeaOfTheDay] Creating system user...');
    systemUser = await prisma.user.create({
      data: {
        email: 'system@ideavalidate.com',
        name: 'IdeaValidate System',
        role: 'ADMIN',
        isVerified: true,
        credits: 999999, // Unlimited credits for system user
      } as any,
    });
    console.log('[IdeaOfTheDay] System user created:', systemUser.id);
  }

  // Generate a random startup idea using AI
  // For now, we'll use a predefined idea template, but this could be AI-generated
  const ideaTemplates = [
    {
      title: 'AI-Powered Personal Finance Coach',
      oneLiner: 'An AI assistant that helps users optimize their spending and savings through personalized financial advice',
      description: 'A mobile app that uses AI to analyze spending patterns, provide personalized budgeting advice, and help users achieve their financial goals. The app connects to bank accounts, categorizes transactions, and offers actionable insights to improve financial health.',
    },
    {
      title: 'Sustainable Fashion Marketplace',
      oneLiner: 'A platform connecting eco-conscious consumers with sustainable fashion brands',
      description: 'An online marketplace exclusively for sustainable and ethical fashion brands. The platform verifies sustainability credentials, provides transparency on supply chains, and helps consumers make environmentally conscious fashion choices.',
    },
    {
      title: 'Remote Team Culture Builder',
      oneLiner: 'A platform that helps remote teams build stronger connections and company culture',
      description: 'A SaaS platform that provides tools for remote teams to build culture, including virtual team building activities, culture assessments, and engagement metrics. Helps companies maintain team cohesion in distributed work environments.',
    },
    {
      title: 'AI-Powered Meal Planning Service',
      oneLiner: 'Personalized meal planning and grocery delivery based on dietary preferences and health goals',
      description: 'A service that uses AI to create personalized meal plans based on dietary restrictions, health goals, and preferences. Includes automated grocery list generation and optional ingredient delivery. Learns from user feedback to improve recommendations.',
    },
    {
      title: 'Mental Health Support Platform',
      oneLiner: 'An accessible platform connecting people with mental health resources and peer support',
      description: 'A platform that provides affordable mental health support through peer communities, licensed therapists, and self-help resources. Uses AI to match users with appropriate support channels and tracks progress over time.',
    },
  ];

  // Select a random template (or rotate based on date)
  const templateIndex = date.getDate() % ideaTemplates.length;
  const template = ideaTemplates[templateIndex];

  // Create the idea
  console.log('[IdeaOfTheDay] Creating idea:', template.title);
  const idea = await prisma.idea.create({
    data: {
      title: template.title,
      oneLiner: template.oneLiner,
      description: template.description,
      userId: systemUser.id,
      status: 'DRAFT',
    },
  });
  console.log('[IdeaOfTheDay] Idea created:', idea.id);

  // Generate full analysis for the idea (this can take 30-60 seconds)
  console.log('[IdeaOfTheDay] Starting analysis generation (this may take a minute)...');
  let analysis;
  try {
    analysis = await generateIdeaAnalysis(idea.id, systemUser.id);
    console.log('[IdeaOfTheDay] Analysis completed:', analysis.id);
  } catch (error: any) {
    console.error('[IdeaOfTheDay] Analysis generation failed:', error);
    throw new Error(`Failed to generate analysis: ${error.message}`);
  }

  // Mark idea as completed
  await prisma.idea.update({
    where: { id: idea.id },
    data: { status: 'COMPLETED' },
  });

  // Create idea of the day record
  console.log('[IdeaOfTheDay] Creating idea of the day record...');
  const ideaOfTheDay = await (prisma as any).ideaOfTheDay.create({
    data: {
      date: date,
      ideaId: idea.id,
      analysisId: analysis.id,
      title: template.title,
      oneLiner: template.oneLiner,
      description: template.description,
    },
    include: {
      idea: {
        include: {
          attachments: true,
        },
      },
      analysis: true,
    },
  });
  console.log('[IdeaOfTheDay] Idea of the day created successfully:', ideaOfTheDay.id);

  return ideaOfTheDay;
}

/**
 * Get idea of the day for today (public endpoint)
 */
export async function getTodayIdeaOfTheDay() {
  return getIdeaOfTheDay(new Date());
}

/**
 * Pre-generate idea of the day for today (call on server startup)
 * This triggers generation in background if needed
 */
export async function pregenerateTodayIdea() {
  try {
    console.log('[IdeaOfTheDay] Pre-generating today\'s idea on server startup...');
    // This will return null if generation is needed, and start it in background
    const idea = await getIdeaOfTheDay(new Date());
    if (idea) {
      console.log('[IdeaOfTheDay] Today\'s idea already exists:', idea.id);
    } else {
      console.log('[IdeaOfTheDay] Today\'s idea generation started in background');
      // Generation is now running in background, will complete in ~1 minute
    }
  } catch (error) {
    console.error('[IdeaOfTheDay] Failed to pre-generate idea:', error);
  }
}

/**
 * Get idea of the day by ID
 */
export async function getIdeaOfTheDayById(id: string) {
  return (prisma as any).ideaOfTheDay.findUnique({
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
}

