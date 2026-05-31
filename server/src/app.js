import express from 'express';
import morgan from 'morgan';
import { corsMiddleware } from './config/cors.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import healthRoutes from './routes/health.routes.js';
import interviewRoutes from './routes/interview.routes.js';
import recruiterRoutes from './routes/recruiter.routes.js';
import mediaRoutes from './routes/media.routes.js';

const app = express();

app.use(morgan('dev'));
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/media', mediaRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
