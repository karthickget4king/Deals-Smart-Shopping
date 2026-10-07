import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

// API health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'Deals Smart Shopping',
    timestamp: new Date().toISOString(),
  });
});

// Serve production static assets from dist
const distPath = path.resolve(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// SPA fallback for all other routes
app.get('*', (_req: Request, res: Response) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('Deals Smart Shopping building... please refresh in a moment.');
  }
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server terminated cleanly');
  });
});

