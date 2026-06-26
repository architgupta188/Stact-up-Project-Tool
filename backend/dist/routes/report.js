import { Router } from 'express';
import { randomUUID } from 'crypto';
import { db } from '../db/index.js';
import { reports } from '../db/schema.js';
import { eq, desc, and } from 'drizzle-orm';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { reportGenerationLimiter } from '../middleware/rateLimit.js';
import { reportInputSchema } from '../utils/validation.js';
import { createSSEResponse } from '../utils/sse.js';
import { runPipeline } from '../services/pipelineService.js';
export const reportRouter = Router();
function getParam(val) {
    return Array.isArray(val) ? val[0] : val ?? '';
}
// POST /api/report/generate
reportRouter.post('/generate', requireAuth, reportGenerationLimiter, async (req, res) => {
    try {
        const parseResult = reportInputSchema.safeParse(req.body);
        if (!parseResult.success) {
            console.error('Validation error on generate:', parseResult.error.flatten().fieldErrors, 'Payload:', req.body);
            res.status(422).json({
                error: 'VALIDATION_ERROR',
                fields: parseResult.error.flatten().fieldErrors,
            });
            return;
        }
        const input = parseResult.data;
        const userId = req.user.id;
        const ideaName = 'ideaName' in input ? input.ideaName : null;
        const [report] = await db.insert(reports).values({
            userId,
            role: input.role,
            status: 'pending',
            inputData: input,
            ideaName,
        }).returning();
        const sse = createSSEResponse(res);
        runPipeline(report.id, input, sse).catch(err => {
            console.error('Pipeline error:', err);
        });
    }
    catch (err) {
        console.error('API Error in /generate:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
        }
    }
});
// GET /api/report/:reportId
reportRouter.get('/:reportId', optionalAuth, async (req, res) => {
    try {
        const reportId = getParam(req.params.reportId);
        const [report] = await db.select().from(reports).where(eq(reports.id, reportId)).limit(1);
        if (!report) {
            res.status(404).json({ error: 'NOT_FOUND' });
            return;
        }
        const isOwner = req.user && report.userId === req.user.id;
        if (!isOwner && !report.shareToken) {
            res.status(403).json({ error: 'FORBIDDEN' });
            return;
        }
        res.json({
            id: report.id,
            role: report.role,
            status: report.status,
            inputData: report.inputData,
            outputData: report.outputData,
            score: report.score,
            verdict: report.verdict,
            shareToken: isOwner ? report.shareToken : null,
            ideaName: report.ideaName,
            createdAt: report.createdAt,
        });
    }
    catch (err) {
        res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
    }
});
// GET /api/reports (history) — this handles the root of the mount
reportRouter.get('/', requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const userReports = await db.select({
            id: reports.id,
            role: reports.role,
            ideaName: reports.ideaName,
            score: reports.score,
            verdict: reports.verdict,
            status: reports.status,
            createdAt: reports.createdAt,
        })
            .from(reports)
            .where(eq(reports.userId, userId))
            .orderBy(desc(reports.createdAt))
            .limit(10);
        res.json({ reports: userReports, total: userReports.length });
    }
    catch (err) {
        res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
    }
});
// POST /api/report/:reportId/share
reportRouter.post('/:reportId/share', requireAuth, async (req, res) => {
    try {
        const reportId = getParam(req.params.reportId);
        const userId = req.user.id;
        const [report] = await db.select().from(reports).where(and(eq(reports.id, reportId), eq(reports.userId, userId))).limit(1);
        if (!report) {
            res.status(404).json({ error: 'NOT_FOUND' });
            return;
        }
        if (report.shareToken) {
            res.json({
                shareToken: report.shareToken,
                shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/share/${report.shareToken}`,
            });
            return;
        }
        const shareToken = randomUUID();
        await db.update(reports).set({ shareToken }).where(eq(reports.id, reportId));
        res.json({
            shareToken,
            shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/share/${shareToken}`,
        });
    }
    catch (err) {
        res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
    }
});
// DELETE /api/report/:reportId
reportRouter.delete('/:reportId', requireAuth, async (req, res) => {
    try {
        const reportId = getParam(req.params.reportId);
        const userId = req.user.id;
        const [report] = await db.select().from(reports).where(and(eq(reports.id, reportId), eq(reports.userId, userId))).limit(1);
        if (!report) {
            res.status(404).json({ error: 'NOT_FOUND' });
            return;
        }
        await db.delete(reports).where(eq(reports.id, reportId));
        res.json({ message: 'Report deleted' });
    }
    catch (err) {
        res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
    }
});
//# sourceMappingURL=report.js.map