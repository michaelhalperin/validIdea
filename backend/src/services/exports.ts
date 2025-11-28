import prisma from '../utils/prisma';

/**
 * Export analysis to Notion format (Markdown)
 */
export async function exportToNotion(analysisId: string, userId: string): Promise<string> {
  const analysis = await prisma.analysis.findUnique({
    where: { id: analysisId },
    include: { idea: true },
  });

  if (!analysis || analysis.userId !== userId) {
    throw new Error('Analysis not found or access denied');
  }

  const idea = analysis.idea;
  const a = analysis as any;

  let markdown = `# ${idea.title}\n\n`;
  markdown += `**${idea.oneLiner}**\n\n`;
  markdown += `${idea.description}\n\n`;
  markdown += `---\n\n`;

  // Executive Summary
  if (a.executiveSummary) {
    markdown += `## Executive Summary\n\n${a.executiveSummary}\n\n`;
  }

  // Market Size
  const marketSize = a.marketSize;
  if (marketSize) {
    markdown += `## Market Size\n\n`;
    markdown += `**TAMN Estimate:** $${marketSize.tamn_estimate_usd?.toLocaleString()}\n\n`;
    markdown += `${marketSize.reasoning}\n\n`;
  }

  // Competitors
  const competitors = a.competitors || [];
  if (competitors.length > 0) {
    markdown += `## Competitors\n\n`;
    competitors.forEach((comp: any) => {
      markdown += `### ${comp.name}\n`;
      markdown += `${comp.why_competitor}\n\n`;
    });
  }

  // SWOT
  const swot = a.swot;
  if (swot) {
    markdown += `## SWOT Analysis\n\n`;
    markdown += `### Strengths\n${swot.strengths?.map((s: string) => `- ${s}`).join('\n')}\n\n`;
    markdown += `### Weaknesses\n${swot.weaknesses?.map((w: string) => `- ${w}`).join('\n')}\n\n`;
    markdown += `### Opportunities\n${swot.opportunities?.map((o: string) => `- ${o}`).join('\n')}\n\n`;
    markdown += `### Threats\n${swot.threats?.map((t: string) => `- ${t}`).join('\n')}\n\n`;
  }

  // Roadmap
  const roadmap = a.roadmap || [];
  if (roadmap.length > 0) {
    markdown += `## Roadmap\n\n`;
    roadmap.forEach((phase: any, index: number) => {
      markdown += `### Phase ${index + 1}: ${phase.name}\n`;
      markdown += `${phase.description}\n\n`;
    });
  }

  return markdown;
}

/**
 * Export analysis to CSV format
 */
export async function exportToCSV(analysisId: string, userId: string): Promise<string> {
  const analysis = await prisma.analysis.findUnique({
    where: { id: analysisId },
    include: { idea: true },
  });

  if (!analysis || analysis.userId !== userId) {
    throw new Error('Analysis not found or access denied');
  }

  const a = analysis as any;
  const rows: string[][] = [];

  // Header
  rows.push(['Field', 'Value']);

  // Basic info
  rows.push(['Title', analysis.idea.title]);
  rows.push(['One Liner', analysis.idea.oneLiner]);
  rows.push(['Confidence Score', String(a.confidenceOverall || '')]);
  rows.push(['Opportunity Score', String((a.opportunity as any)?.score || '')]);

  // Market Size
  const marketSize = a.marketSize;
  if (marketSize) {
    rows.push(['Market Size (TAMN)', String(marketSize.tamn_estimate_usd || '')]);
  }

  // Competitors
  const competitors = a.competitors || [];
  rows.push(['Number of Competitors', String(competitors.length)]);

  // Financial
  const costEstimate = a.costEstimate;
  if (costEstimate) {
    rows.push(['Development Cost', String(costEstimate.dev_cost_usd || '')]);
    rows.push(['First Year COGS', String(costEstimate.cogs_first_year_usd || '')]);
    rows.push(['First Year Marketing', String(costEstimate.marketing_first_year_usd || '')]);
  }

  // Convert to CSV
  return rows.map(row => 
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\n');
}

/**
 * Export analysis to JSON format
 */
export async function exportToJSON(analysisId: string, userId: string): Promise<any> {
  const analysis = await prisma.analysis.findUnique({
    where: { id: analysisId },
    include: { idea: true },
  });

  if (!analysis || analysis.userId !== userId) {
    throw new Error('Analysis not found or access denied');
  }

  return {
    idea: {
      id: analysis.idea.id,
      title: analysis.idea.title,
      oneLiner: analysis.idea.oneLiner,
      description: analysis.idea.description,
    },
    analysis: {
      id: analysis.id,
      confidenceOverall: (analysis as any).confidenceOverall,
      opportunity: (analysis as any).opportunity,
      marketSize: (analysis as any).marketSize,
      competitors: (analysis as any).competitors,
      swot: (analysis as any).swot,
      technicalFeasibility: (analysis as any).technicalFeasibility,
      costEstimate: (analysis as any).costEstimate,
      roadmap: (analysis as any).roadmap,
      revenueStreams: (analysis as any).revenueStreams,
      createdAt: analysis.createdAt,
    },
  };
}

/**
 * Export to Google Sheets format (CSV compatible)
 */
export async function exportToGoogleSheets(analysisId: string, userId: string): Promise<string> {
  // Google Sheets can import CSV directly
  return exportToCSV(analysisId, userId);
}

/**
 * Export to Airtable format (CSV compatible)
 */
export async function exportToAirtable(analysisId: string, userId: string): Promise<string> {
  // Airtable can import CSV directly
  return exportToCSV(analysisId, userId);
}

