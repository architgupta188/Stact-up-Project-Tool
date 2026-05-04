import { geminiPro } from '../config/gemini.js';
export async function callGemini(prompt) {
    const result = await geminiPro.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    try {
        return JSON.parse(text);
    }
    catch {
        // Try to extract JSON from the text
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
            }
            catch {
                // If still fails, return raw text wrapped in an object
                return { raw: text };
            }
        }
        return { raw: text };
    }
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