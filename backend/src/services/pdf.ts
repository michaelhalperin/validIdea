import puppeteer from 'puppeteer';
import prisma from '../utils/prisma';

export async function generatePDF(analysisId: string): Promise<Buffer> {
  const analysis = await prisma.analysis.findUnique({
    where: { id: analysisId },
    include: {
      idea: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!analysis) {
    throw new Error('Analysis not found');
  }

  const rawOutput = analysis.rawOutput as any;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #1976d2;
      border-bottom: 3px solid #1976d2;
      padding-bottom: 10px;
    }
    h2 {
      color: #424242;
      margin-top: 30px;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 5px;
    }
    h3 {
      color: #616161;
      margin-top: 20px;
    }
    .section {
      margin-bottom: 30px;
    }
    .competitor {
      margin: 10px 0;
      padding: 10px;
      background: #f5f5f5;
      border-left: 3px solid #1976d2;
    }
    .swot-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin: 20px 0;
    }
    .swot-item {
      padding: 15px;
      border-radius: 5px;
    }
    .strengths { background: #e8f5e9; }
    .weaknesses { background: #ffebee; }
    .opportunities { background: #e3f2fd; }
    .threats { background: #fff3e0; }
    .roadmap-phase {
      margin: 15px 0;
      padding: 15px;
      background: #fafafa;
      border-left: 4px solid #1976d2;
    }
    .confidence {
      display: inline-block;
      padding: 5px 10px;
      background: #1976d2;
      color: white;
      border-radius: 3px;
      font-weight: bold;
    }
    ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    li {
      margin: 5px 0;
    }
    .meta {
      color: #757575;
      font-size: 0.9em;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
    }
  </style>
</head>
<body>
  <h1>${analysis.idea.title}</h1>
  <p><strong>One-liner:</strong> ${analysis.idea.oneLiner}</p>
  
  <div class="section">
    <h2>Executive Summary</h2>
    <p>${analysis.executiveSummary || rawOutput?.executive_summary || 'N/A'}</p>
  </div>

  <div class="section">
    <h2>Market Size</h2>
    ${analysis.marketSize ? `
      <p><strong>Total Addressable Market (TAM):</strong> $${(analysis.marketSize as any).tamn_estimate_usd?.toLocaleString() || 'N/A'}</p>
      <p><strong>Reasoning:</strong> ${(analysis.marketSize as any).reasoning || 'N/A'}</p>
      ${(analysis.marketSize as any).data_points ? `
        <ul>
          ${(analysis.marketSize as any).data_points.map((point: string) => `<li>${point}</li>`).join('')}
        </ul>
      ` : ''}
    ` : '<p>N/A</p>'}
  </div>

  <div class="section">
    <h2>Top Competitors</h2>
    ${analysis.competitors && Array.isArray(analysis.competitors) ? 
      (analysis.competitors as any[]).map((comp: any) => `
        <div class="competitor">
          <h3>${comp.name || 'Unknown'}</h3>
          <p>${comp.why_competitor || ''}</p>
          ${comp.public_urls && comp.public_urls.length > 0 ? `
            <p><strong>Links:</strong> ${comp.public_urls.join(', ')}</p>
          ` : ''}
          <p><strong>Confidence:</strong> ${comp.confidence || 'N/A'}%</p>
        </div>
      `).join('') : '<p>N/A</p>'}
  </div>

  <div class="section">
    <h2>SWOT Analysis</h2>
    ${analysis.swot ? `
      <div class="swot-grid">
        <div class="swot-item strengths">
          <h3>Strengths</h3>
          <ul>
            ${((analysis.swot as any).strengths || []).map((s: string) => `<li>${s}</li>`).join('')}
          </ul>
        </div>
        <div class="swot-item weaknesses">
          <h3>Weaknesses</h3>
          <ul>
            ${((analysis.swot as any).weaknesses || []).map((w: string) => `<li>${w}</li>`).join('')}
          </ul>
        </div>
        <div class="swot-item opportunities">
          <h3>Opportunities</h3>
          <ul>
            ${((analysis.swot as any).opportunities || []).map((o: string) => `<li>${o}</li>`).join('')}
          </ul>
        </div>
        <div class="swot-item threats">
          <h3>Threats</h3>
          <ul>
            ${((analysis.swot as any).threats || []).map((t: string) => `<li>${t}</li>`).join('')}
          </ul>
        </div>
      </div>
    ` : '<p>N/A</p>'}
  </div>

  <div class="section">
    <h2>Technical Feasibility</h2>
    ${analysis.technicalFeasibility ? `
      <p><strong>Recommended Stack:</strong> ${((analysis.technicalFeasibility as any).stack || []).join(', ') || 'N/A'}</p>
      <p><strong>Complexity Rating:</strong> ${(analysis.technicalFeasibility as any).complexity_rating || 'N/A'}/10</p>
      <p><strong>Estimated Development Time:</strong> ${(analysis.technicalFeasibility as any).estimated_dev_months || 'N/A'} months</p>
    ` : '<p>N/A</p>'}
  </div>

  <div class="section">
    <h2>Cost Estimate</h2>
    ${analysis.costEstimate ? `
      <p><strong>Development Cost:</strong> $${((analysis.costEstimate as any).dev_cost_usd || 0).toLocaleString()}</p>
      <p><strong>COGS (First Year):</strong> $${((analysis.costEstimate as any).cogs_first_year_usd || 0).toLocaleString()}</p>
      <p><strong>Marketing (First Year):</strong> $${((analysis.costEstimate as any).marketing_first_year_usd || 0).toLocaleString()}</p>
      ${((analysis.costEstimate as any).assumptions ? `
        <h3>Assumptions</h3>
        <ul>
          ${((analysis.costEstimate as any).assumptions.map((a: string) => `<li>${a}</li>`).join(''))}
        </ul>
      ` : '')}
    ` : '<p>N/A</p>'}
  </div>

  <div class="section">
    <h2>Roadmap</h2>
    ${analysis.roadmap && Array.isArray(analysis.roadmap) ? 
      (analysis.roadmap as any[]).map((phase: any) => `
        <div class="roadmap-phase">
          <h3>${phase.phase || 'Phase'}</h3>
          <p><strong>Duration:</strong> ${phase.duration_months || 'N/A'} months</p>
          <ul>
            ${(phase.goals || []).map((goal: string) => `<li>${goal}</li>`).join('')}
          </ul>
        </div>
      `).join('') : '<p>N/A</p>'}
  </div>

  <div class="section">
    <h2>Next Steps</h2>
    <p>${analysis.nextSteps || rawOutput?.next_steps || 'N/A'}</p>
  </div>

  <div class="section">
    <h2>Investor Pitch</h2>
    ${analysis.investorPitch ? `
      <p><strong>One-liner:</strong> ${(analysis.investorPitch as any).one_liner || 'N/A'}</p>
      <p><strong>60-second pitch:</strong> ${(analysis.investorPitch as any)['60s_pitch'] || 'N/A'}</p>
    ` : '<p>N/A</p>'}
  </div>

  <div class="section">
    <h2>Opportunity Assessment</h2>
    ${(analysis as any).opportunity ? `
      <p><strong>Opportunity Score:</strong> <span class="confidence">${((analysis as any).opportunity as any).score || 'N/A'}%</span></p>
      <p><strong>Pain Level:</strong> ${((analysis as any).opportunity as any).pain_level || 'N/A'}</p>
      <p><strong>Market Demand:</strong> ${((analysis as any).opportunity as any).market_demand || 'N/A'}</p>
      <p><strong>Feasibility:</strong> ${((analysis as any).opportunity as any).feasibility || 'N/A'}</p>
      <p><strong>Timing:</strong> ${((analysis as any).opportunity as any).why_now || 'N/A'}</p>
      <p><strong>Unfair Advantage:</strong> ${((analysis as any).opportunity as any).unfair_advantage || 'N/A'}</p>
    ` : '<p>N/A</p>'}
  </div>

  ${(analysis as any).whyNow ? `
    <div class="section">
      <h2>Why Now?</h2>
      <p>${(analysis as any).whyNow}</p>
    </div>
  ` : ''}

  ${(analysis as any).businessFit ? `
    <div class="section">
      <h2>Business Fit</h2>
      <p><strong>Revenue Potential:</strong> ${((analysis as any).businessFit as any).revenue_potential || 'N/A'}</p>
      <p><strong>Execution Difficulty:</strong> ${((analysis as any).businessFit as any).execution_difficulty || 'N/A'}</p>
      <p><strong>Go-to-Market Efficiency:</strong> ${((analysis as any).businessFit as any).go_to_market_efficiency || 'N/A'}</p>
    </div>
  ` : ''}

  ${(analysis as any).offerStructure ? `
    <div class="section">
      <h2>Value Ladder</h2>
      <p><strong>Lead Magnet:</strong> ${((analysis as any).offerStructure as any).lead_magnet || 'N/A'}</p>
      <p><strong>Frontend:</strong> ${((analysis as any).offerStructure as any).frontend || 'N/A'}</p>
      <p><strong>Core Offer:</strong> ${((analysis as any).offerStructure as any).core_offer || 'N/A'}</p>
      <p><strong>Backend:</strong> ${((analysis as any).offerStructure as any).backend || 'N/A'}</p>
      <p><strong>Continuity:</strong> ${((analysis as any).offerStructure as any).continuity || 'N/A'}</p>
    </div>
  ` : ''}

  ${(analysis as any).categorization ? `
    <div class="section">
      <h2>Categorization</h2>
      <p><strong>Type:</strong> ${((analysis as any).categorization as any).type || 'N/A'}</p>
      <p><strong>Market:</strong> ${((analysis as any).categorization as any).market || 'N/A'}</p>
      <p><strong>Target Audience:</strong> ${((analysis as any).categorization as any).target || 'N/A'}</p>
      <p><strong>Main Competitor:</strong> ${((analysis as any).categorization as any).main_competitor || 'N/A'}</p>
    </div>
  ` : ''}

  ${(analysis as any).signals ? `
    <div class="section">
      <h2>Market Signals</h2>
      <p><strong>Community Engagement:</strong> ${((analysis as any).signals as any).community_engagement || 'N/A'}</p>
      <p><strong>Search Trends:</strong> ${((analysis as any).signals as any).search_trends || 'N/A'}</p>
      <p><strong>Market Gap:</strong> ${((analysis as any).signals as any).market_gap || 'N/A'}</p>
    </div>
  ` : ''}

  <div class="section">
    <h2>Confidence Score</h2>
    <p><span class="confidence">${analysis.confidenceOverall || 'N/A'}%</span></p>
  </div>

  <div class="meta">
    <p><strong>Generated:</strong> ${analysis.createdAt.toLocaleString()}</p>
    <p><strong>Token Usage:</strong> ${analysis.tokenUsage || 'N/A'}</p>
  </div>
</body>
</html>
  `;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm',
      },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

