import prisma from '../utils/prisma';
import { generateInvestorReport } from './gemini';

interface InvestorReport {
  executiveSummary: string;
  problemStatement: string;
  solution: string;
  marketOpportunity: {
    size: number;
    growth: string;
    trends: string[];
  };
  businessModel: {
    revenueStreams: string[];
    pricing: string;
    unitEconomics: string;
  };
  traction: string;
  competitiveAdvantage: string;
  team: string;
  financialProjections: {
    year1: { revenue: number; expenses: number; users: number };
    year2: { revenue: number; expenses: number; users: number };
    year3: { revenue: number; expenses: number; users: number };
  };
  fundingAsk: {
    amount: number;
    useOfFunds: string[];
    milestones: string[];
  };
  pitchDeck: {
    slides: Array<{ title: string; content: string }>;
  };
}

/**
 * Generate investor-ready report
 */
export async function generateInvestorReportForIdea(
  ideaId: string,
  userId: string
): Promise<InvestorReport> {
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

  const analysis = (idea as any).analyses[0] as any;

  const ideaForReport = {
    id: idea.id,
    title: idea.title,
    one_liner: idea.oneLiner,
    description: idea.description,
  };

  // Use Gemini to generate investor report
  const report = await generateInvestorReport(ideaForReport as any, analysis);

  // Save the report to the database
  await (prisma as any).investorReport.upsert({
    where: { ideaId },
    update: {
      report: report as any,
    },
    create: {
      ideaId,
      userId,
      report: report as any,
    },
  });

  return report;
}

/**
 * Get saved investor report for an idea
 */
export async function getInvestorReportForIdea(
  ideaId: string,
  userId: string
): Promise<InvestorReport | null> {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, userId },
  });

  if (!idea) {
    throw new Error('Idea not found or access denied');
  }

  const savedReport = await (prisma as any).investorReport.findUnique({
    where: { ideaId },
  });

  if (!savedReport) {
    return null;
  }

  return savedReport.report as InvestorReport;
}

