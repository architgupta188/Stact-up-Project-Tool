import { geminiPro } from '../config/gemini.js';
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export async function callGemini(prompt, maxRetries = 2) {
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const result = await geminiPro.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            try {
                return JSON.parse(text);
            }
            catch {
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    try {
                        return JSON.parse(jsonMatch[0]);
                    }
                    catch {
                        return { raw: text };
                    }
                }
                return { raw: text };
            }
        }
        catch (error) {
            lastError = error;
            if ((error.status === 429 || error.status >= 500) && attempt < maxRetries) {
                const delay = Math.min(3000 * Math.pow(2, attempt), 12000); // 3s, 6s, 12s
                console.log(`Gemini API rate limited (attempt ${attempt + 1}/${maxRetries + 1}). Retrying in ${delay / 1000}s...`);
                await sleep(delay);
                continue;
            }
            throw error;
        }
    }
    throw lastError;
}
export async function* streamGeminiChat(systemPrompt, history, userMessage) {
    const chatHistory = history.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
    }));
    const chat = geminiPro.startChat({
        history: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: 'Understood. I will act as the report analyst and answer questions based on the report data.' }] },
            ...chatHistory,
        ],
    });
    const result = await chat.sendMessageStream(userMessage);
    for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text)
            yield text;
    }
}
//# sourceMappingURL=geminiService.js.map