import { Router } from 'express';
import { db } from '../db/index.js';
import { conversations, reports } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth.js';
import { chatLimiter } from '../middleware/rateLimit.js';
import { chatMessageSchema } from '../utils/validation.js';
import { createSSEResponse } from '../utils/sse.js';
import { streamGeminiChat } from '../services/geminiService.js';
import { buildChatSystemPrompt } from '../prompts/index.js';
export const chatRouter = Router();
const MAX_TURNS = 10;
function getParam(val) {
    return Array.isArray(val) ? val[0] : val ?? '';
}
// POST /api/report/:reportId/chat
chatRouter.post('/report/:reportId/chat', requireAuth, chatLimiter, async (req, res) => {
    try {
        const reportId = getParam(req.params.reportId);
        const userId = req.user.id;
        const parseResult = chatMessageSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(422).json({ error: 'VALIDATION_ERROR', fields: parseResult.error.flatten().fieldErrors });
            return;
        }
        const { message } = parseResult.data;
        const [report] = await db.select().from(reports).where(and(eq(reports.id, reportId), eq(reports.userId, userId))).limit(1);
        if (!report) {
            res.status(404).json({ error: 'NOT_FOUND' });
            return;
        }
        if (report.status !== 'complete') {
            res.status(400).json({ error: 'REPORT_NOT_READY', message: 'Report is still generating.' });
            return;
        }
        let [conversation] = await db.select().from(conversations).where(eq(conversations.reportId, reportId)).limit(1);
        if (!conversation) {
            [conversation] = await db.insert(conversations).values({
                reportId,
                userId,
                messages: [],
                turnCount: 0,
            }).returning();
        }
        if (conversation.turnCount >= MAX_TURNS) {
            res.status(429).json({
                error: 'CHAT_LIMIT_REACHED',
                message: `Maximum ${MAX_TURNS} turns per report.`,
            });
            return;
        }
        const systemPrompt = buildChatSystemPrompt(report.outputData);
        const msgs = conversation.messages || [];
        const updatedMessages = [
            ...msgs,
            { role: 'user', content: message, timestamp: new Date().toISOString() },
        ];
        const sse = createSSEResponse(res);
        try {
            const tokenStream = await streamGeminiChat(systemPrompt, msgs, message);
            let fullResponse = '';
            for await (const token of tokenStream) {
                fullResponse += token;
                sse.send('token', { content: token });
            }
            updatedMessages.push({
                role: 'assistant',
                content: fullResponse,
                timestamp: new Date().toISOString(),
            });
            await db.update(conversations).set({
                messages: updatedMessages,
                turnCount: conversation.turnCount + 1,
                updatedAt: new Date(),
            }).where(eq(conversations.id, conversation.id));
            sse.send('done', { turnCount: conversation.turnCount + 1 });
        }
        catch (_error) {
            sse.send('error', { message: 'Failed to generate response.' });
        }
        finally {
            sse.close();
        }
    }
    catch (err) {
        if (!res.headersSent) {
            res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
        }
    }
});
// GET /api/report/:reportId/chat
chatRouter.get('/report/:reportId/chat', requireAuth, async (req, res) => {
    try {
        const reportId = getParam(req.params.reportId);
        const userId = req.user.id;
        const [conversation] = await db.select().from(conversations).where(and(eq(conversations.reportId, reportId), eq(conversations.userId, userId))).limit(1);
        if (!conversation) {
            res.json({ messages: [], turnCount: 0 });
            return;
        }
        res.json({
            messages: conversation.messages,
            turnCount: conversation.turnCount,
        });
    }
    catch (err) {
        res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
    }
});
//# sourceMappingURL=chat.js.map