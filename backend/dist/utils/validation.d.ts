import { z } from 'zod';
export declare const startupInputSchema: z.ZodObject<{
    role: z.ZodLiteral<"startup">;
    ideaName: z.ZodString;
    problemStatement: z.ZodString;
    targetUsers: z.ZodString;
    industry: z.ZodString;
    businessModel: z.ZodString;
    countryRegion: z.ZodString;
    stage: z.ZodString;
    budget: z.ZodString;
    mvpStatus: z.ZodString;
    knownCompetitors: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const investorInputSchema: z.ZodObject<{
    role: z.ZodLiteral<"investor">;
    preferredSectors: z.ZodArray<z.ZodString>;
    investmentStage: z.ZodString;
    riskAppetite: z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
    }>;
    budgetRange: z.ZodString;
    geography: z.ZodString;
    interestKeywords: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const studentInputSchema: z.ZodObject<{
    role: z.ZodLiteral<"student">;
    interests: z.ZodArray<z.ZodString>;
    skills: z.ZodArray<z.ZodString>;
    preferredDomain: z.ZodString;
    budget: z.ZodString;
    intent: z.ZodEnum<{
        build: "build";
        join: "join";
        explore: "explore";
    }>;
}, z.core.$strip>;
export declare const reportInputSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    role: z.ZodLiteral<"startup">;
    ideaName: z.ZodString;
    problemStatement: z.ZodString;
    targetUsers: z.ZodString;
    industry: z.ZodString;
    businessModel: z.ZodString;
    countryRegion: z.ZodString;
    stage: z.ZodString;
    budget: z.ZodString;
    mvpStatus: z.ZodString;
    knownCompetitors: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    role: z.ZodLiteral<"investor">;
    preferredSectors: z.ZodArray<z.ZodString>;
    investmentStage: z.ZodString;
    riskAppetite: z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
    }>;
    budgetRange: z.ZodString;
    geography: z.ZodString;
    interestKeywords: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
    role: z.ZodLiteral<"student">;
    interests: z.ZodArray<z.ZodString>;
    skills: z.ZodArray<z.ZodString>;
    preferredDomain: z.ZodString;
    budget: z.ZodString;
    intent: z.ZodEnum<{
        build: "build";
        join: "join";
        explore: "explore";
    }>;
}, z.core.$strip>], "role">;
export declare const chatMessageSchema: z.ZodObject<{
    message: z.ZodString;
}, z.core.$strip>;
