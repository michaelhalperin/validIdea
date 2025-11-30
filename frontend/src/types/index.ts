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
    sam_estimate_usd?: number;
    som_estimate_usd?: number;
    reasoning: string;
    data_points: string[];
    growth_rate_cagr?: number;
    market_maturity?: 'Emerging' | 'Growing' | 'Mature' | 'Declining';
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
  unitEconomics?: {
    estimated_cac_usd: number;
    estimated_ltv_usd: number;
    ltv_cac_ratio: number;
    payback_period_months: number;
    contribution_margin_percent: number;
    break_even_customers: number;
    assumptions: string[];
  };
  riskAssessment?: {
    technical_risks: Array<{
      risk: string;
      probability: 'Low' | 'Medium' | 'High';
      impact: 'Low' | 'Medium' | 'High';
      mitigation: string;
    }>;
    market_risks: Array<{
      risk: string;
      probability: 'Low' | 'Medium' | 'High';
      impact: 'Low' | 'Medium' | 'High';
      mitigation: string;
    }>;
    financial_risks: Array<{
      risk: string;
      probability: 'Low' | 'Medium' | 'High';
      impact: 'Low' | 'Medium' | 'High';
      mitigation: string;
    }>;
    regulatory_risks: Array<{
      risk: string;
      probability: 'Low' | 'Medium' | 'High';
      impact: 'Low' | 'Medium' | 'High';
      mitigation: string;
    }>;
    operational_risks: Array<{
      risk: string;
      probability: 'Low' | 'Medium' | 'High';
      impact: 'Low' | 'Medium' | 'High';
      mitigation: string;
    }>;
  };
  competitiveDifferentiation?: {
    unique_value_props: string[];
    moat_strength: 'Weak' | 'Moderate' | 'Strong';
    moat_type: 'Network Effects' | 'Switching Costs' | 'Brand' | 'Technology' | 'Data' | 'None';
    defensibility_score: number;
    competitive_response_likelihood: 'Low' | 'Medium' | 'High';
  };
  pricingAnalysis?: {
    recommended_pricing_model: string;
    price_sensitivity: 'Low' | 'Medium' | 'High';
    competitive_pricing_comparison: Array<{
      competitor: string;
      price: string;
      our_advantage: string;
    }>;
    pricing_strategy_rationale: string;
    freemium_viability: 'Yes' | 'No' | 'Maybe';
    discount_strategy: string;
  };
  acquisitionFunnel?: {
    awareness_channels: string[];
    consideration_touchpoints: string[];
    conversion_strategies: string[];
    estimated_conversion_rates: {
      awareness_to_consideration: number;
      consideration_to_trial: number;
      trial_to_paid: number;
    };
    key_drop_off_points: string[];
    optimization_opportunities: string[];
  };
  regulatoryAnalysis?: {
    applicable_regulations: string[];
    compliance_requirements: string[];
    licensing_needs: string[];
    data_privacy_considerations: string[];
    industry_specific_requirements: string[];
    estimated_compliance_cost_usd: number;
  };
  partnershipOpportunities?: {
    strategic_partners: Array<{
      type: string;
      description: string;
      value_proposition: string;
    }>;
    integration_opportunities: string[];
    distribution_partners: string[];
  };
  teamRequirements?: {
    critical_roles: Array<{
      role: string;
      priority: 'Critical' | 'Important' | 'Nice to have';
      skill_requirements: string[];
      hiring_difficulty: 'Easy' | 'Medium' | 'Hard';
      estimated_salary_usd: number;
    }>;
    team_size_by_phase: {
      mvp: number;
      launch: number;
      scale: number;
    };
    skill_gaps: string[];
  };
  scalabilityAnalysis?: {
    technical_bottlenecks: string[];
    infrastructure_requirements: string[];
    scaling_costs: {
      per_1000_users_usd: number;
      per_10000_users_usd: number;
    };
    operational_scaling_challenges: string[];
    scalability_score: number;
  };
  retentionAnalysis?: {
    predicted_churn_rate_percent: number;
    retention_strategies: string[];
    upsell_opportunities: string[];
    cross_sell_opportunities: string[];
    customer_success_requirements: string[];
    estimated_ltv_improvement_potential: string;
  };
  technologyAnalysis?: {
    stack_justification: string;
    technology_risks: string[];
    vendor_lock_in_concerns: string[];
    migration_difficulty: 'Low' | 'Medium' | 'High';
    future_proofing_score: number;
    open_source_alternatives: string[];
  };
  timingAnalysis?: {
    market_readiness: 'Too Early' | 'Perfect Timing' | 'Too Late';
    seasonal_considerations: string[];
    launch_window_recommendation: string;
    market_cycle_position: 'Early' | 'Growth' | 'Mature' | 'Decline';
    timing_risks: string[];
  };
  exitAnalysis?: {
    potential_acquirers: Array<{
      company: string;
      rationale: string;
      fit_score: number;
    }>;
    ipo_feasibility: 'Low' | 'Medium' | 'High';
    estimated_exit_timeline_years: number;
    exit_valuation_range: string;
    strategic_vs_financial_buyer: 'Strategic' | 'Financial' | 'Both';
  };
  customerJourney?: {
    awareness_stage: {
      touchpoints: string[];
      pain_points: string[];
      content_needs: string[];
    };
    consideration_stage: {
      touchpoints: string[];
      pain_points: string[];
      content_needs: string[];
    };
    purchase_stage: {
      touchpoints: string[];
      pain_points: string[];
      content_needs: string[];
    };
    retention_stage: {
      touchpoints: string[];
      pain_points: string[];
      content_needs: string[];
    };
  };
  tokenUsage?: number;
  createdAt: string;
  updatedAt: string;
  rawOutput?: any;
}

