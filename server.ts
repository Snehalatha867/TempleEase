import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/routes/api.js';
import { connectDB } from './server/config/db.js';
import { seedDatabase } from './server/seed/seeder.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const isProd = process.env.NODE_ENV === 'production';
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be set to at least 32 characters.');
  }

  const configuredOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);
  if (isProd && configuredOrigins.length === 0) {
    throw new Error('CLIENT_URL must contain the production frontend origin in production.');
  }

  // Attempt database connection & run idempotent MongoDB seeding if connected
  const dbConnected = await connectDB();
  if (dbConnected) {
    await seedDatabase();
  }

  // Middleware
  const allowedOrigins = isProd
    ? configuredOrigins
    : [...new Set([...configuredOrigins, 'http://localhost:3000', 'http://localhost:5173'])];
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error('Origin is not allowed by the CORS configuration.'));
      },
      credentials: true
    })
  );
  app.use(express.json({ limit: '5mb' }));

  // Mount API routes
  app.use('/api', apiRouter);

  // Serve static assets from public & images folders
  app.use(express.static(path.resolve(__dirname, 'public')));
  app.use('/images', express.static(path.resolve(__dirname, 'public/images')));
  app.use('/images', express.static(path.resolve(__dirname, 'dist/images')));
  // Fallback for legacy development references to /src/assets/images
  app.use('/src/assets/images', express.static(path.resolve(__dirname, 'public/images')));
  app.use('/src/assets/images', express.static(path.resolve(__dirname, 'dist/images')));

  if (!isProd) {
    // Development mode with Vite middleware
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT
      },
      appType: 'spa'
    });

    app.use(vite.middlewares);
  } else {
    // Production mode: serve static files from dist
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Temple Ease] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[Temple Ease] Failed to start server:', err);
  process.exit(1);
});
