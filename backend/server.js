import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import { authRouter } from './routes/auth.js';
import { meRouter } from './routes/me.js';
import { applicationRouter } from './routes/application.js';
import { requireAuth, requireAdmin } from './middleware/requireAuth.js';
import eventRouter  from './routes/events.js'
import memberRoutes from './routes/members.js'
import contributionRouter from './routes/contributions.js'
import gsocRouter from './routes/gsoc.js'
import prAssistantRouter from './routes/prAssistant.js'
import contentRouter from './routes/content.js'
import notificationRouter from './routes/notifications.js'
import analyticsRouter from './routes/analytics.js'




dotenv.config()

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser())

app.get('/', (_, res) => res.send('vosc backend running'));
app.use('/api/auth/me', meRouter);
app.use('/api/auth', authRouter);
app.use('/api/applications', requireAuth, requireAdmin, applicationRouter);
app.use('/api', eventRouter);
app.use('/api/members', memberRoutes);
app.use('/api', contributionRouter);
app.use('/api', gsocRouter);
app.use('/api', prAssistantRouter);
app.use('/api', contentRouter);
app.use('/api', notificationRouter);
app.use('/api', analyticsRouter);







app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`
    }
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred'
    }
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
