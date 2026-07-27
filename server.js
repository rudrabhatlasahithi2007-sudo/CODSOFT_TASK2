import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import app from './backend/app.js';
import connectDB from './backend/config/db.js';
import { notFound, errorHandler } from './backend/middleware/errorMiddleware.js';

const PORT = 3000;

async function startServer() {
  await connectDB();

  // Mount Vite middleware for development / preview
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'frontend', 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Error & Unmatched Route Handlers
  app.use(notFound);
  app.use(errorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TaskPulse Full Stack App running on http://localhost:${PORT}`);
  });
}

startServer();
