import type { StartupInput } from '../types/report.js';
export declare function buildClassifyPrompt(input: StartupInput): string;
export declare function buildScoringPrompt(input: StartupInput, newsContext: string, schemeContext: string): string;
export declare function buildStartupReportPrompt(input: StartupInput, scores: any, newsContext: string, schemeContext: string): string;
export declare function buildInvestorReportPrompt(input: any, newsContext: string): string;
export declare function buildStudentReportPrompt(input: any, newsContext: string): string;
export declare function buildChatSystemPrompt(reportOutput: any): string;
