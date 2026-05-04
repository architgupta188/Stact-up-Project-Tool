import { z } from 'zod';
export const startupInputSchema = z.object({
    role: z.literal('startup'),
    ideaName: z.string().min(3).max(80),
    problemStatement: z.string().min(50).max(500),
    targetUsers: z.string().min(10).max(200),
    industry: z.string().min(1),
    businessModel: z.string().min(1),
    countryRegion: z.string().min(2),
    stage: z.string().min(1),
    budget: z.string().min(1),
    mvpStatus: z.string().min(1),
    knownCompetitors: z.string().max(300).optional(),
});
export const investorInputSchema = z.object({
    role: z.literal('investor'),
    preferredSectors: z.array(z.string()).min(1).max(3),
    investmentStage: z.string().min(1),
    riskAppetite: z.enum(['low', 'medium', 'high']),
    budgetRange: z.string().min(1),
    geography: z.string().min(2),
    interestKeywords: z.array(z.string()).max(5).optional(),
});
export const studentInputSchema = z.object({
    role: z.literal('student'),
    interests: z.array(z.string()).min(1),
    skills: z.array(z.string()).min(1),
    preferredDomain: z.string().min(1),
    budget: z.string().min(1),
    intent: z.enum(['build', 'join', 'explore']),
});
export const reportInputSchema = z.discriminatedUnion('role', [
    startupInputSchema,
    investorInputSchema,
    studentInputSchema,
]);
export const chatMessageSchema = z.object({
    message: z.string().min(1).max(1000),
});
//# sourceMappingURL=validation.js.map