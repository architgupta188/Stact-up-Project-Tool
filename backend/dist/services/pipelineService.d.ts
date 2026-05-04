import type { StartupInput, InvestorInput, StudentInput, ReportInput } from '../types/report.js';
type SSE = {
    send: (event: string, data: object) => void;
    close: () => void;
};
export declare function runStartupPipeline(reportId: string, input: StartupInput, sse: SSE): Promise<void>;
export declare function runInvestorPipeline(reportId: string, input: InvestorInput, sse: SSE): Promise<void>;
export declare function runStudentPipeline(reportId: string, input: StudentInput, sse: SSE): Promise<void>;
export declare function runPipeline(reportId: string, input: ReportInput, sse: SSE): Promise<void>;
export {};
