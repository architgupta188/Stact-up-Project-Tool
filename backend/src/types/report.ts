// ── Enums ──

export const INDUSTRIES = [
  'Agriculture', 'CleanTech', 'Construction & Real Estate', 'D2C / E-commerce',
  'Deep Tech', 'EdTech', 'FinTech', 'FoodTech', 'Government / GovTech',
  'HealthTech', 'HR & Future of Work', 'Legal Tech', 'Logistics & Supply Chain',
  'Manufacturing', 'Media & Entertainment', 'Mobility & EV', 'Retail & Consumer',
  'SaaS / B2B Software', 'Social Impact', 'Travel & Hospitality'
] as const;

export const BUSINESS_MODELS = [
  'SaaS', 'Marketplace', 'D2C / E-commerce', 'Service Business',
  'Hardware / IoT', 'Subscription', 'Freemium', 'Transactional', 'Other'
] as const;

export const STARTUP_STAGES = [
  'Idea Only', 'Wireframe / Concept', 'Prototype Built',
  'MVP Live', 'Early Revenue', 'Growth Stage'
] as const;

export const BUDGETS = [
  'Below ₹1 Lakh', '₹1–5 Lakhs', '₹5–25 Lakhs',
  '₹25 Lakhs – ₹1 Crore', 'Above ₹1 Crore', 'Not Disclosed'
] as const;

export const MVP_STATUSES = [
  'No MVP yet', 'Wireframe done', 'Prototype built',
  'MVP live (beta)', 'Launched and getting users'
] as const;

export const INVESTMENT_STAGES = [
  'Pre-seed / Angel', 'Seed', 'Series A', 'Growth / Series B+', 'Any Stage'
] as const;

export const STUDENT_BUDGETS = [
  'Zero budget', 'Below ₹10,000', '₹10,000 – ₹50,000', '₹50,000+'
] as const;

// ── Input Types ──

export interface StartupInput {
  role: 'startup';
  ideaName: string;
  problemStatement: string;
  targetUsers: string;
  industry: string;
  businessModel: string;
  countryRegion: string;
  stage: string;
  budget: string;
  mvpStatus: string;
  knownCompetitors?: string;
}

export interface InvestorInput {
  role: 'investor';
  preferredSectors: string[];
  investmentStage: string;
  riskAppetite: 'low' | 'medium' | 'high';
  budgetRange: string;
  geography: string;
  interestKeywords?: string[];
}

export interface StudentInput {
  role: 'student';
  interests: string[];
  skills: string[];
  preferredDomain: string;
  budget: string;
  intent: 'build' | 'join' | 'explore';
}

export type ReportInput = StartupInput | InvestorInput | StudentInput;

// ── Output Types ──

export interface DimensionScore {
  score: number;
  rationale: string;
}

export interface CompetitorCard {
  name: string;
  description: string;
  differentiator: string;
  threat: 'low' | 'medium' | 'high';
}

export interface TrendItem {
  title: string;
  summary: string;
  source?: string;
  date?: string;
}

export interface SchemeItem {
  name: string;
  description: string;
  eligibility: string;
  benefit: string;
  link?: string;
}

export interface RiskItem {
  risk: string;
  severity: 'low' | 'medium' | 'high';
  mitigation: string;
}

export interface RecommendationItem {
  priority: number;
  action: string;
  reason: string;
}

export interface ActionWeek {
  week: number;
  goal: string;
  tasks: string[];
}

export interface NewsArticle {
  title: string;
  description: string;
  source: string;
  publishedAt: string;
  url: string;
}

export interface StartupReportOutput {
  role: 'startup';
  generatedAt: string;
  dimensionScores: {
    painLevel: DimensionScore;
    urgency: DimensionScore;
    marketSize: DimensionScore;
    adoptionSpeed: DimensionScore;
    competitionIntensity: DimensionScore;
    willingnessToPay: DimensionScore;
    differentiation: DimensionScore;
    executionDifficulty: DimensionScore;
    mvpFeasibility: DimensionScore;
    marketTiming: DimensionScore;
  };
  compositeScore: number;
  verdict: 'go' | 'revise' | 'no-go';
  verdictRationale: string;
  sections: {
    ideaSummary: string;
    problemAnalysis: string;
    targetAudienceAnalysis: string;
    marketOpportunity: {
      tamEstimate: string;
      samEstimate: string;
      somEstimate: string;
      narrative: string;
    };
    competitionAnalysis: {
      competitors: CompetitorCard[];
      positioning: string;
      gaps: string[];
    };
    industryTrends: TrendItem[];
    governmentSchemes: SchemeItem[];
    mvpSuggestions: string;
    risks: RiskItem[];
    recommendations: RecommendationItem[];
    fundingFit: string;
    actionPlan: ActionWeek[];
    finalVerdict: string;
  };
  newsArticles: NewsArticle[];
  researchContext: string;
}

export interface InvestorReportOutput {
  role: 'investor';
  generatedAt: string;
  sections: {
    sectorOverview: string;
    trendingCategories: Array<{
      name: string;
      growthSignal: 'high' | 'medium' | 'low';
      description: string;
      examples: string[];
    }>;
    redFlags: Array<{ flag: string; detail: string }>;
    policyImpact: string;
    opportunityMap: Array<{
      sector: string;
      maturity: number;
      growthRate: number;
      marketSize: string;
    }>;
    sectorsToWatch: string[];
    dueDiligenceAngles: string[];
  };
}

export interface StudentReportOutput {
  role: 'student';
  generatedAt: string;
  sections: {
    ideaMatches: Array<{
      rank: number;
      name: string;
      description: string;
      feasibility: 'Beginner' | 'Intermediate' | 'Advanced';
      budgetRequired: string;
      keyChallenge: string;
    }>;
    skillsToLearn: Array<{
      skill: string;
      priority: number;
      resource: string;
    }>;
    mvpRoadmap?: Array<{
      month: number;
      goal: string;
      tasks: Array<{ task: string; category: string }>;
    }>;
    freeResources: Array<{ name: string; url: string; description: string }>;
    studentPrograms: Array<{ name: string; description: string; eligibility: string }>;
    validationGuide: string;
  };
}

export type ReportOutput = StartupReportOutput | InvestorReportOutput | StudentReportOutput;
