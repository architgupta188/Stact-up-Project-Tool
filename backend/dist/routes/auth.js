import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { env } from '../config/env.js';
import { requireAuth } from '../middleware/auth.js';
export const authRouter = Router();
// /api/auth/signup
authRouter.post('/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Email and password are required' });
            return;
        }
        const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (existingUser.length > 0) {
            res.status(409).json({ error: 'EMAIL_EXISTS', message: 'An account with this email already exists' });
            return;
        }
        const passwordHash = await bcrypt.hash(password, 12);
        const [user] = await db.insert(users).values({
            email,
            name,
            passwordHash,
            defaultRole: 'startup',
        }).returning();
        const accessToken = jwt.sign({ sub: user.id, email: user.email }, env.JWT_SECRET, { expiresIn: '30d' });
        const refreshToken = jwt.sign({ sub: user.id }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        await db.update(users).set({ refreshToken }).where(eq(users.id, user.id));
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'lax',
        });
        res.status(201).json({ user: { id: user.id, email: user.email, name: user.name }, accessToken });
    }
    catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
    }
});
// /api/auth/login
authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (!user || !user.passwordHash) {
            res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect' });
            return;
        }
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect' });
            return;
        }
        const accessToken = jwt.sign({ sub: user.id, email: user.email }, env.JWT_SECRET, { expiresIn: '30d' });
        const refreshToken = jwt.sign({ sub: user.id }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        await db.update(users).set({ refreshToken }).where(eq(users.id, user.id));
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'lax',
        });
        res.status(200).json({ user: { id: user.id, email: user.email, name: user.name }, accessToken });
    }
    catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
    }
});
// /api/auth/refresh
authRouter.post('/refresh', async (req, res) => {
    try {
        const cookieHeader = req.headers.cookie;
        if (!cookieHeader) {
            res.status(401).json({ error: 'INVALID_REFRESH_TOKEN' });
            return;
        }
        const match = cookieHeader.match(/refresh_token=([^;]+)/);
        if (!match) {
            res.status(401).json({ error: 'INVALID_REFRESH_TOKEN' });
            return;
        }
        const token = match[1];
        const payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
        const [user] = await db.select().from(users).where(eq(users.id, payload.sub)).limit(1);
        if (!user || user.refreshToken !== token) {
            res.status(401).json({ error: 'INVALID_REFRESH_TOKEN' });
            return;
        }
        const newAccessToken = jwt.sign({ sub: user.id, email: user.email }, env.JWT_SECRET, { expiresIn: '30d' });
        res.status(200).json({ accessToken: newAccessToken });
    }
    catch (err) {
        res.status(401).json({ error: 'INVALID_REFRESH_TOKEN' });
    }
});
// /api/auth/logout
authRouter.post('/logout', requireAuth, async (req, res) => {
    if (req.user) {
        await db.update(users).set({ refreshToken: null }).where(eq(users.id, req.user.id));
    }
    res.clearCookie('refresh_token');
    res.status(200).json({ message: 'Logged out successfully' });
});
// /api/auth/me — get current user
authRouter.get('/me', requireAuth, async (req, res) => {
    res.json({ user: req.user });
});
//# sourceMappingURL=auth.js.map