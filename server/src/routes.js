import { Router } from 'express';
import { STEPS } from './steps.js';
import {
  listReleases,
  getRelease,
  createRelease,
  updateRelease,
  deleteRelease,
} from './releases.js';

export const router = Router();

// Wrap an async handler so rejected promises reach the error middleware.
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function parseId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'Invalid release id' });
    return null;
  }
  return id;
}

// Expose the fixed list of steps so the frontend can render the checklist
// without hard-coding it in two places.
router.get('/steps', (req, res) => {
  res.json(STEPS);
});

router.get('/releases', wrap(async (req, res) => {
  res.json(await listReleases());
}));

router.get('/releases/:id', wrap(async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const release = await getRelease(id);
  if (!release) return res.status(404).json({ error: 'Release not found' });
  res.json(release);
}));

router.post('/releases', wrap(async (req, res) => {
  const { name, date, additionalInfo } = req.body ?? {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (!date || Number.isNaN(Date.parse(date))) {
    return res.status(400).json({ error: 'A valid date is required' });
  }

  const release = await createRelease({ name, date, additionalInfo });
  res.status(201).json(release);
}));

router.patch('/releases/:id', wrap(async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;

  const { additionalInfo, completedSteps } = req.body ?? {};
  if (additionalInfo === undefined && completedSteps === undefined) {
    return res.status(400).json({ error: 'Nothing to update' });
  }

  const release = await updateRelease(id, { additionalInfo, completedSteps });
  if (!release) return res.status(404).json({ error: 'Release not found' });
  res.json(release);
}));

router.delete('/releases/:id', wrap(async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const ok = await deleteRelease(id);
  if (!ok) return res.status(404).json({ error: 'Release not found' });
  res.status(204).end();
}));
