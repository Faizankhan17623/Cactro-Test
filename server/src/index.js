import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Simple health check, handy for the hosting provider.
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'releasecheck-api' });
});

app.use('/api', router);

// Centralised error handler so route handlers can just throw.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`ReleaseCheck API listening on port ${port}`);
});

export default app;
