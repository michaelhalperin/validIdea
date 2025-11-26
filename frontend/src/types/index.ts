export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: 'USER' | 'ADMIN';
  credits: number;
  creditsUsed: number;
  notifyEmail?: boolean;
  notifyUpdates?: boolean;
  notifyMarketing?: boolean;
  createdAt?: string;
  googleId?: string | null;
  isVerified?: boolean;
}

export interface Idea {
  id: string;
  title: string;
  oneLiner: string;
  description: string;
  status: 'DRAFT' | 'ANALYZING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  updatedAt: string;
  attachments?: Attachment[];
  analyses?: Analysis[];
}

export interface Attachment {
  id: string;
  type: 'IMAGE' | 'PDF' | 'SLIDE_LINK' | 'VIDEO_LINK' | 'OTHER';
  url: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
}

export interface Analysis {
  id: string;
  ideaId: string;
  userId: string;
  executiveSummary?: string;
  marketSize?: {
    tamn_estimate_usd: number;
    reasoning: string;
    data_points: string[];
  };
  competitors?: Array<{
    name: string;
    why_competitor: string;
    public_urls: string[];
    confidence: number;
  }>;
  swot?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  technicalFeasibility?: {
    stack: string[];
    complexity_rating: number;
    estimated_dev_months: number;
  };
  costEstimate?: {
    dev_cost_usd: number;
    cogs_first_year_usd: number;
    marketing_first_year_usd: number;
    assumptions: string[];
  };
  roadmap?: Array<{
    phase: string;
    goals: string[];
    duration_months: number;
  }>;
  nextSteps?: string;
  investorPitch?: {
    one_liner: string;
    '60s_pitch': string;
  };
  confidenceOverall?: number;
  keywords?: string[];
  marketTrends?: Array<{
    trend: string;
    impact: string;
    direction: 'UP' | 'DOWN' | 'STABLE';
  }>;
  deepResearch?: Array<{
    topic: string;
    summary: string;
    source_url?: string;
  }>;
  userPersonas?: Array<{
    role: string;
    pain_points: string[];
    willingness_to_pay: 'High' | 'Medium' | 'Low';
  }>;
  marketingChannels?: Array<{
    channel: string;
    effectiveness: 'High' | 'Medium' | 'Low';
    strategy: string;
  }>;
  revenueStreams?: Array<{
    model: string;
    pricing_strategy: string;
    estimated_ltv_usd?: number;
  }>;
  opportunity?: {
    score: number;
    pain_level: string;
    market_demand: string;
    feasibility: string;
    why_now: string;
    unfair_advantage: string;
  };
  businessFit?: {
    revenue_potential: string;
    execution_difficulty: string;
    go_to_market_efficiency: string;
  };
  offerStructure?: {
    lead_magnet: string;
    frontend: string;
    core_offer: string;
    backend: string;
    continuity: string;
  };
  categorization?: {
    type: string;
    market: string;
    target: string;
    main_competitor: string;
  };
  whyNow?: string;
  signals?: {
    community_engagement: string;
    search_trends: string;
    market_gap: string;
  };
  tokenUsage?: number;
  createdAt: string;
  updatedAt: string;
  rawOutput?: any;
}

