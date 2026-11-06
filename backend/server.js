import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import scoreRoutes from './routes/scores.js';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

if (!process.env.JWT_SECRET) {
  if (isProduction) {
    console.error('JWT_SECRET is required in production. Refusing to start.');
    process.exit(1);
  }
  process.env.JWT_SECRET = 'dev-only-insecure-secret-change-before-deploying';
  console.warn('JWT_SECRET not set. Using an insecure development-only secret.');
} else if (isProduction && process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be at least 32 characters in production.');
  process.exit(1);
}

await connectDB();

const app = express();
app.set('trust proxy', 1);

// Security headers. The API does not serve HTML, so CSP is managed by the host.
app.use(helmet({ contentSecurityPolicy: false }));

const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true); // curl, same-origin, health checks
      if (allowedOrigins.includes(origin)) return callback(null, true);

      if (!isProduction) {
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
          return callback(null, true);
        }
        if (/^https:\/\/[a-z0-9-]+\.trycloudflare\.com$/i.test(origin)) {
          return callback(null, true);
        }
        if (/^https:\/\/[a-z0-9-]+\.netlify\.app$/i.test(origin)) {
          return callback(null, true);
        }
      }

      return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
    maxAge: 86400,
    optionsSuccessStatus: 204,
  }),
);

app.use(cookieParser());
app.use(express.json({ limit: '100kb' }));

// Reject non-JSON write requests. HTML forms cannot send application/json, which
// blocks the classic cross-site form-submission CSRF path.
app.use((req, res, next) => {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return next();

  const contentType = req.headers['content-type'];
  if (!contentType || contentType.toLowerCase().startsWith('application/json')) return next();

  return res.status(415).json({ message: 'Content-Type must be application/json' });
});

// Global rate limit + stricter limit for auth endpoints (brute-force protection).
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.use(
  '/api/auth',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: { message: 'Too many attempts, please try again later.' },
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CredWise API is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, _next) => {
  if (err.message === 'Origin not allowed by CORS') {
    return res.status(403).json({ message: 'Origin not allowed' });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }
  console.error(err.stack);
  return res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = Number(process.env.PORT) || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

let shuttingDown = false;
async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} received. Shutting down gracefully...`);
  const forceExit = setTimeout(() => process.exit(1), 10000);
  forceExit.unref();

  server.close(async () => {
    try {
      await mongoose.disconnect();
    } catch (error) {
      console.error('Error disconnecting MongoDB:', error.message);
    }
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
