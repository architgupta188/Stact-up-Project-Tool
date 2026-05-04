export declare function callGemini(prompt: string): Promise<any>;
export declare function streamGeminiChat(systemPrompt: string, history: Array<{
    role: string;
    content: string;
}>, userMessage: string): AsyncGenerator<string, void, unknown>;
