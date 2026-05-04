import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { env } from '../config/env.js';

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'MISSING_TOKEN' });
    return;
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string; email: string };
    const [user] = await db.select().from(users).where(eq(users.id, payload.sub)).limit(1);

    if (!user) {
      res.status(401).json({ error: 'USER_NOT_FOUND' });
      return;
    }

    req.user = { id: user.id, email: user.email, role: user.defaultRole ?? 'startup' };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'TOKEN_EXPIRED' });
      return;
    }
    res.status(401).json({ error: 'INVALID_TOKEN' });
  }
}

export async function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next();
    return;
  }
  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string };
    req.user = { id: payload.sub, email: '', role: '' };
  } catch {
    // Ignore errors for optional auth
  }
  next();
}
