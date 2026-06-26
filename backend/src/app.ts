import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { authRouter } from './routes/auth.js';
import { reportRouter } from './routes/report.js';
import { chatRouter } from './routes/chat.js';
import discoverRouter from './routes/discover.js';
import { errorHandler } from './middleware/errorHandler.js';
import { globalLimiter } from './middleware/rateLimit.js';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(globalLimiter);

// Routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use('/api/auth', authRouter);
app.use('/api/report', reportRouter);
app.use('/api/reports', reportRouter); // alias for history
app.use('/api', chatRouter);
app.use('/api', discoverRouter);

// Error handler
app.use(errorHandler);

export { app };
