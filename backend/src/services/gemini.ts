import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are an elite Tier-1 Venture Capital Analyst, Senior CTO, and Market Researcher. Your goal is to provide a rigorous, critical, and highly detailed analysis of startup ideas, backed by data. 

Do not just validate the idea; challenge its assumptions.
Focus on "Why Now?", "Unfair Advantage", and "Monetization Viability".

Output Guidelines:
- Be extremely specific. Avoid generic advice like "focus on marketing". Instead, say "target developer communities on Reddit and Hacker News".
- For Market Size: Use Bottom-Up analysis reasoning where possible (e.g., "X users * Y price").
- For Competitors: Highlight *specific* differentiation points. Why will this win?
- For Technical Feasibility: Identify specific architectural bottlenecks and scalability risks.
- For Costs: Be realistic. Startups often underestimate marketing and cloud costs.
- For Roadmap: Focus on de-risking milestones (e.g., "Validate willingness to pay") rather than just "build feature X".
- For Research: Provide concrete topics that need validation and where to find them.
- For Trends: Identify specific market movements (e.g., "Rise of local-first software").
- For Personas: Define exactly who buys this and why.
- For Growth: Identify the most efficient channels to acquire users.
- For Revenue: Propose clear monetization models.

Always return valid JSON. Avoid hallucinating URLs. If uncertain, label as 'assumption'.`;

interface IdeaInput {
  title: string;
  one_liner: string;
  description: string;
  attachments?: Array<{
    type: string;
    url?: string;
    fileName?: string;
    summary?: string;
  }>;
}

interface AnalysisOutput {
  executive_summary: string;
  market_size: {
    tamn_estimate_usd: number;
    reasoning: string;
    data_points: string[];
  };
  top_competitors: Array<{
    name: string;
    why_competitor: string;
    public_urls: string[];
    confidence: number;
  }>;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  technical_feasibility: {
    stack: string[];
    complexity_rating: number; // 1-10
    estimated_dev_months: number;
  };
  cost_estimate: {
    dev_cost_usd: number;
    cogs_first_year_usd: number;
    marketing_first_year_usd: number;
    assumptions: string[];
  };
  roadmap: Array<{
    phase: string;
    goals: string[];
    duration_months: number;
  }>;
  next_steps: string;
  investor_pitch: {
    one_liner: string;
    "60s_pitch": string;
  };
  confidence_overall: number;
  keywords: string[];
  market_trends: Array<{
    trend: string;
    impact: string;
    direction: "UP" | "DOWN" | "STABLE";
  }>;
  deep_research: Array<{
    topic: string;
    summary: string;
    source_url?: string;
  }>;
  user_personas: Array<{
    role: string;
    pain_points: string[];
    willingness_to_pay: "High" | "Medium" | "Low";
  }>;
  marketing_channels: Array<{
    channel: string;
    effectiveness: "High" | "Medium" | "Low";
    strategy: string;
  }>;
  revenue_streams: Array<{
    model: string;
    pricing_strategy: string;
    estimated_ltv_usd?: number;
  }>;
  opportunity: {
    score: number;
    pain_level: string;
    market_demand: string;
    feasibility: string;
    why_now: string;
    unfair_advantage: string;
  };
  business_fit: {
    revenue_potential: string;
    execution_difficulty: string;
    go_to_market_efficiency: string;
  };
  offer_structure: {
    lead_magnet: string;
    frontend: string;
    core_offer: string;
    backend: string;
    continuity: string;
  };
  categorization: {
    type: string;
    market: string;
    target: string;
    main_competitor: string;
  };
  why_now: string;
  signals: {
    community_engagement: string;
    search_trends: string;
    market_gap: string;
  };
}

export async function generateAnalysis(
  idea: IdeaInput
): Promise<AnalysisOutput> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-pro",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.2,
    },
  });

  const userPrompt = `Input:
{
  "title": "${idea.title}",
  "one_liner": "${idea.one_liner}",
  "description": "${idea.description}",
  "attachments": ${JSON.stringify(idea.attachments || [])}
}

Return JSON with:
- executive_summary (string): A high-impact overview of the opportunity and critical verdict.
- market_size: {
    tamn_estimate_usd (number), 
    reasoning (string): "Detailed bottom-up calculation logic", 
    data_points (string[]): ["Source A", "Source B"]
  }
- top_competitors: [{
    name (string), 
    why_competitor (string): "Specific feature overlap or value prop conflict", 
    public_urls (string[]), 
    confidence (number 0-100)
  }]
- swot: {
    strengths (string[]): "Internal advantages", 
    weaknesses (string[]): "Internal gaps", 
    opportunities (string[]): "External market trends", 
    threats (string[]): "External risks (competitors, regulation)"
  }
- technical_feasibility: {
    stack (string[]): ["Specific tech 1", "Specific tech 2"], 
    complexity_rating (number 1-10), 
    estimated_dev_months (number)
  }
- cost_estimate: {
    dev_cost_usd (number), 
    cogs_first_year_usd (number), 
    marketing_first_year_usd (number), 
    assumptions (string[]): ["Assumption 1", "Assumption 2"]
  }
- roadmap: [{
    phase (string): "Phase Name (e.g. MVP, Beta)", 
    goals (string[]): ["Specific, measurable goal"], 
    duration_months (number)
  }]
- next_steps (string): Immediate, high-impact actions to validate the idea.
- investor_pitch: {
    one_liner (string), 
    '60s_pitch' (string)
  }
- confidence_overall (number 0-100): Your honest assessment of success probability.
- keywords (string[]): ["keyword1", "keyword2"] - High-value search terms and industry jargon.
- market_trends: [{
    trend (string), 
    impact (string), 
    direction ("UP" | "DOWN" | "STABLE")
  }]
- deep_research: [{
    topic (string), 
    summary (string), 
    source_url (string - optional)
  }]
- user_personas: [{
    role (string): "Target user title/role",
    pain_points (string[]),
    willingness_to_pay ("High" | "Medium" | "Low")
  }]
- marketing_channels: [{
    channel (string): "Specific channel (e.g. LinkedIn Ads)",
    effectiveness ("High" | "Medium" | "Low"),
    strategy (string): "Tactical approach for this channel"
  }]
  - revenue_streams: [{
    model (string): "Revenue model type (e.g. Subscription)",
    pricing_strategy (string): "Specific pricing tactics",
    estimated_ltv_usd (number - optional)
  }]
- opportunity: {
    score (number 0-100): "Overall opportunity score",
    pain_level ("Low" | "Medium" | "High" | "Extreme"),
    market_demand ("Low" | "Medium" | "High" | "Extreme"),
    feasibility ("Low" | "Medium" | "High"),
    why_now ("Bad" | "Neutral" | "Good" | "Perfect"),
    unfair_advantage (string): "What gives this an edge?"
  }
- business_fit: {
    revenue_potential (string): "e.g. $1M-$10M ARR",
    execution_difficulty ("Low" | "Medium" | "High"),
    go_to_market_efficiency ("Low" | "Medium" | "High")
  }
- offer_structure: {
    lead_magnet (string): "Free value to capture leads",
    frontend (string): "Low-ticket entry offer",
    core_offer (string): "Main product/service",
    backend (string): "High-ticket upsell",
    continuity (string): "Recurring revenue component"
  }
- categorization: {
    type (string): "e.g. SaaS, Marketplace, Mobile App",
    market (string): "e.g. B2B, B2C",
    target (string): "Primary target audience",
    main_competitor (string): "The 'Category King' to displace"
  }
- why_now (string): "A compelling narrative on why this specific moment is the right time (technological, social, or regulatory shifts)."
- signals: {
    community_engagement (string): "Predicted reception on platforms like Reddit/ProductHunt",
    search_trends (string): "Likely search behavior/keywords volume",
    market_gap (string): "The specific hole in the market this fills"
  }

Return ONLY valid JSON, no markdown formatting.`;

  let retries = 3;
  let lastError: Error | null = null;

  while (retries > 0) {
    try {
      const result = await model.generateContent(userPrompt);
      const response = result.response;
      const text = response.text();

      // Try to extract JSON from response (handle markdown code blocks)
      let jsonText = text.trim();
      if (jsonText.startsWith("```")) {
        jsonText = jsonText
          .replace(/^```(?:json)?\n?/, "")
          .replace(/\n?```$/, "");
      }

      const analysis = JSON.parse(jsonText) as AnalysisOutput;

      // Validate required fields
      if (
        !analysis.executive_summary ||
        !analysis.market_size ||
        !analysis.top_competitors
      ) {
        throw new Error("Invalid analysis structure");
      }

      return analysis;
    } catch (error: any) {
      lastError = error;
      retries--;

      if (
        error.message?.includes("rate limit") ||
        error.message?.includes("429")
      ) {
        // Exponential backoff for rate limits
        const delay = Math.pow(2, 3 - retries) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else if (retries === 0) {
        throw error;
      }
    }
  }

  throw lastError || new Error("Failed to generate analysis");
}

export async function regenerateSection(
  idea: IdeaInput,
  section: string
): Promise<any> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-pro",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.2,
    },
  });

  const prompts: Record<string, string> = {
    competitors: `Regenerate the competitor section. Identify direct, indirect, and potential future competitors. Focus explicitly on their weaknesses and exactly how this idea differentiates. Input: ${JSON.stringify(
      idea
    )}`,
    roadmap: `Regenerate the roadmap. Break it down into critical de-risking milestones (e.g., "Validate problem", "First paying customer"). Include validation steps, not just engineering tasks. Input: ${JSON.stringify(
      idea
    )}`,
    swot: `Regenerate the SWOT analysis with brutal honesty. Focus heavily on 'Threats' and 'Weaknesses' that could kill the startup, and 'Opportunities' that are time-sensitive. Input: ${JSON.stringify(
      idea
    )}`,
  };

  const prompt =
    prompts[section] ||
    `Regenerate the ${section} section. Input: ${JSON.stringify(idea)}`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    let jsonText = text.trim();
    if (jsonText.startsWith("```")) {
      jsonText = jsonText
        .replace(/^```(?:json)?\n?/, "")
        .replace(/\n?```$/, "");
    }

    return JSON.parse(jsonText);
  } catch (error) {
    throw new Error(`Failed to regenerate ${section}: ${error}`);
  }
}

/**
 * Generate chat response about an analysis
 */
export async function generateChatResponse(
  analysis: any,
  history: Array<{ role: string; content: string }>,
  userMessage: string
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-pro",
    systemInstruction: `You are an AI assistant helping users understand their startup idea analysis. 
    You have access to a complete analysis report. Answer questions clearly and concisely.
    Reference specific metrics and data from the analysis when relevant.
    If asked about something not in the analysis, say so clearly.`,
    generationConfig: {
      temperature: 0.7,
    },
  });

  const idea = analysis.idea;
  const analysisSummary = {
    title: idea.title,
    confidence: analysis.confidenceOverall,
    opportunityScore: (analysis.opportunity as any)?.score,
    marketSize: (analysis.marketSize as any)?.tamn_estimate_usd,
    competitors: (analysis.competitors as any[])?.length || 0,
    keyStrengths: (analysis.swot as any)?.strengths?.slice(0, 3) || [],
    keyWeaknesses: (analysis.swot as any)?.weaknesses?.slice(0, 3) || [],
  };

  // Build conversation context
  const context = `Analysis Context:
${JSON.stringify(analysisSummary, null, 2)}

Previous conversation:
${history.map((h) => `${h.role}: ${h.content}`).join('\n')}

User question: ${userMessage}`;

  try {
    const result = await model.generateContent(context);
    return result.response.text();
  } catch (error: any) {
    throw new Error(`Failed to generate chat response: ${error.message}`);
  }
}

/**
 * Generate investor-ready report
 */
export async function generateInvestorReport(
  idea: IdeaInput & { id: string },
  analysis: any
): Promise<any> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-pro",
    systemInstruction: `You are an expert at creating investor pitch decks and financial projections.
    Create a comprehensive, investor-ready report based on the startup idea and analysis.
    Be realistic and data-driven.`,
    generationConfig: {
      temperature: 0.3,
    },
  });

  const prompt = `Generate an investor-ready report for this startup idea:

Idea: ${idea.title}
${idea.description}

Analysis Summary:
- Confidence Score: ${analysis.confidenceOverall}
- Market Size: $${(analysis.marketSize as any)?.tamn_estimate_usd?.toLocaleString()}
- Opportunity Score: ${(analysis.opportunity as any)?.score}
- Key Strengths: ${(analysis.swot as any)?.strengths?.slice(0, 3).join(', ')}
- Revenue Streams: ${(analysis.revenueStreams as any[])?.map((r: any) => r.model).join(', ')}

Create a comprehensive investor report with:
1. Executive Summary (2-3 paragraphs)
2. Problem Statement (clear pain point)
3. Solution (how this solves it)
4. Market Opportunity (size, growth, trends)
5. Business Model (revenue streams, pricing, unit economics)
6. Traction (if any, or validation milestones)
7. Competitive Advantage (unfair advantage)
8. Team (ideal team composition)
9. Financial Projections (3-year forecast with realistic assumptions)
10. Funding Ask (amount, use of funds, milestones)
11. Pitch Deck Outline (10-12 slides with titles and key content)

Return as JSON with this structure:
{
  "executiveSummary": "...",
  "problemStatement": "...",
  "solution": "...",
  "marketOpportunity": {
    "size": number,
    "growth": "...",
    "trends": ["...", "..."]
  },
  "businessModel": {
    "revenueStreams": ["...", "..."],
    "pricing": "...",
    "unitEconomics": "..."
  },
  "traction": "...",
  "competitiveAdvantage": "...",
  "team": "...",
  "financialProjections": {
    "year1": { "revenue": number, "expenses": number, "users": number },
    "year2": { "revenue": number, "expenses": number, "users": number },
    "year3": { "revenue": number, "expenses": number, "users": number }
  },
  "fundingAsk": {
    "amount": number,
    "useOfFunds": ["...", "..."],
    "milestones": ["...", "..."]
  },
  "pitchDeck": {
    "slides": [
      { "title": "...", "content": "..." }
    ]
  }
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text().trim();

    if (text.startsWith("```")) {
      text = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    return JSON.parse(text);
  } catch (error: any) {
    throw new Error(`Failed to generate investor report: ${error.message}`);
  }
}
