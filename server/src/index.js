import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import resourcesRouter from './routes/resources.js';
import moodRouter from './routes/mood.js';
import quizRouter from './routes/quiz.js';
import helplinesRouter from './routes/helplines.js';
import communityRouter from './routes/community.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Global middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  optionsSuccessStatus: 200,
}));
app.use(express.json());

// Global rate limiter (100 req/min per IP)
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please slow down.' },
}));

// Routes
app.use('/api/resources', resourcesRouter);
app.use('/api/mood', moodRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/helplines', helplinesRouter);
app.use('/api/community', communityRouter);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// 404
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
