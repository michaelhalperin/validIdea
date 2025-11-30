import prisma from "../utils/prisma";
import { generateAnalysis, regenerateSection } from "./gemini";
import { AttachmentType } from "@prisma/client";
import { sendAnalysisCompleteEmail } from "./email";

interface CreateIdeaData {
  title: string;
  oneLiner: string;
  description: string;
  userId: string;
  attachments?: Array<{
    type: AttachmentType;
    url: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    metadata?: any;
  }>;
}

export async function createIdea(data: CreateIdeaData) {
  const idea = await prisma.idea.create({
    data: {
      title: data.title,
      oneLiner: data.oneLiner,
      description: data.description,
      userId: data.userId,
      status: "DRAFT",
      attachments: data.attachments
        ? {
            create: data.attachments,
          }
        : undefined,
    },
    include: {
      attachments: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  return idea;
}

export async function generateIdeaAnalysis(ideaId: string, userId: string) {
  // Check and reset user credits
  let user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const now = new Date();
  const lastReset = new Date(user.lastCreditReset);
  const isNewDay =
    now.getDate() !== lastReset.getDate() ||
    now.getMonth() !== lastReset.getMonth() ||
    now.getFullYear() !== lastReset.getFullYear();

  if (isNewDay) {
    // Reset credits to 3 if it's a new day
    user = await prisma.user.update({
      where: { id: userId },
      data: {
        credits: 3,
        lastCreditReset: now,
      },
      include: {
        ideas: false,
        analyses: false,
      },
    });
  }

  if (user.credits <= 0) {
    throw new Error("Daily credit limit reached");
  }

  // Get idea with attachments
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
    include: { attachments: true },
  });

  if (!idea) {
    throw new Error("Idea not found");
  }

  if (idea.userId !== userId) {
    throw new Error("Unauthorized");
  }

  // Update idea status
  await prisma.idea.update({
    where: { id: ideaId },
    data: { status: "ANALYZING" },
  });

  try {
    // Prepare attachment summaries for Gemini
    const attachmentSummaries = idea.attachments.map((att) => ({
      type: att.type as string,
      url: att.url,
      fileName: att.fileName ?? undefined,
    }));

    // Generate analysis
    const analysisResult = await generateAnalysis({
      title: idea.title,
      one_liner: idea.oneLiner,
      description: idea.description,
      attachments: attachmentSummaries,
    });

    // Estimate token usage (rough estimate: 1 token ≈ 4 characters)
    const estimatedTokens = Math.ceil(
      JSON.stringify(analysisResult).length / 4
    );

    // Save analysis
    const analysis = await prisma.analysis.create({
      data: {
        ideaId: idea.id,
        userId: userId,
        rawOutput: analysisResult as any,
        executiveSummary: analysisResult.executive_summary,
        marketSize: analysisResult.market_size as any,
        competitors: analysisResult.top_competitors as any,
        swot: analysisResult.swot as any,
        technicalFeasibility: analysisResult.technical_feasibility as any,
        costEstimate: analysisResult.cost_estimate as any,
        roadmap: analysisResult.roadmap as any,
        nextSteps: analysisResult.next_steps,
        investorPitch: analysisResult.investor_pitch as any,
        confidenceOverall: analysisResult.confidence_overall,
        keywords: analysisResult.keywords,
        marketTrends: analysisResult.market_trends as any,
        deepResearch: analysisResult.deep_research as any,
        userPersonas: analysisResult.user_personas as any,
        marketingChannels: analysisResult.marketing_channels as any,
        revenueStreams: analysisResult.revenue_streams as any,
        opportunity: analysisResult.opportunity as any,
        businessFit: analysisResult.business_fit as any,
        offerStructure: analysisResult.offer_structure as any,
        categorization: analysisResult.categorization as any,
        whyNow: analysisResult.why_now,
        signals: analysisResult.signals as any,
        unitEconomics: analysisResult.unit_economics as any,
        riskAssessment: analysisResult.risk_assessment as any,
        competitiveDifferentiation: analysisResult.competitive_differentiation as any,
        pricingAnalysis: analysisResult.pricing_analysis as any,
        acquisitionFunnel: analysisResult.acquisition_funnel as any,
        regulatoryAnalysis: analysisResult.regulatory_analysis as any,
        partnershipOpportunities: analysisResult.partnership_opportunities as any,
        teamRequirements: analysisResult.team_requirements as any,
        scalabilityAnalysis: analysisResult.scalability_analysis as any,
        retentionAnalysis: analysisResult.retention_analysis as any,
        technologyAnalysis: analysisResult.technology_analysis as any,
        timingAnalysis: analysisResult.timing_analysis as any,
        exitAnalysis: analysisResult.exit_analysis as any,
        customerJourney: analysisResult.customer_journey as any,
        tokenUsage: estimatedTokens,
      } as any,
    });

    // Update idea status and increment credits used
    await prisma.idea.update({
      where: { id: ideaId },
      data: { status: "COMPLETED" },
    });

    // Decrement user credits
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { decrement: 1 },
        creditsUsed: { increment: 1 },
      },
    });

    // Send notification email
    if (user.notifyEmail) {
      await sendAnalysisCompleteEmail(user.email, idea.title, idea.id);
    }

    return analysis;
  } catch (error) {
    await prisma.idea.update({
      where: { id: ideaId },
      data: { status: "FAILED" },
    });
    throw error;
  }
}

export async function regenerateAnalysisSection(
  ideaId: string,
  userId: string,
  section: string
) {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
    include: { attachments: true },
  });

  if (!idea) {
    throw new Error("Idea not found");
  }

  if (idea.userId !== userId) {
    throw new Error("Unauthorized");
  }

  const attachmentSummaries = idea.attachments.map((att) => ({
    type: att.type as string,
    url: att.url,
    fileName: att.fileName ?? undefined,
  }));

  const regeneratedSection = await regenerateSection(
    {
      title: idea.title,
      one_liner: idea.oneLiner,
      description: idea.description,
      attachments: attachmentSummaries,
    },
    section
  );

  // Update the analysis with the regenerated section
  const analysis = await prisma.analysis.findFirst({
    where: { ideaId, userId },
    orderBy: { createdAt: "desc" },
  });

  if (!analysis) {
    throw new Error("Analysis not found");
  }

  const updateData: any = {};
  const rawOutput = analysis.rawOutput as any;

  switch (section) {
    case "competitors":
      updateData.competitors =
        regeneratedSection.top_competitors || regeneratedSection;
      rawOutput.top_competitors =
        regeneratedSection.top_competitors || regeneratedSection;
      break;
    case "roadmap":
      updateData.roadmap = regeneratedSection.roadmap || regeneratedSection;
      rawOutput.roadmap = regeneratedSection.roadmap || regeneratedSection;
      break;
    case "swot":
      updateData.swot = regeneratedSection.swot || regeneratedSection;
      rawOutput.swot = regeneratedSection.swot || regeneratedSection;
      break;
    default:
      rawOutput[section] = regeneratedSection;
  }

  updateData.rawOutput = rawOutput;

  const updatedAnalysis = await prisma.analysis.update({
    where: { id: analysis.id },
    data: updateData,
  });

  return updatedAnalysis;
}
