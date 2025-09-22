import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory data store
let tasks = [];

// Utility validation
const VALID_STATUSES = ['pending', 'in-progress', 'done'];

function validateTaskPayload(body, { partial = false } = {}) {
  const errors = [];
  const { title, description, status, dueDate } = body;
  if (!partial || title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) errors.push('title is required (non-empty string)');
  }
  if (!partial || description !== undefined) {
    if (description !== undefined && typeof description !== 'string') errors.push('description must be a string');
  }
  if (!partial || status !== undefined) {
    if (status !== undefined && !VALID_STATUSES.includes(status)) errors.push(`status must be one of ${VALID_STATUSES.join(', ')}`);
  }
  if (!partial || dueDate !== undefined) {
    if (dueDate !== undefined && Number.isNaN(Date.parse(dueDate))) errors.push('dueDate must be a valid date string');
  }
  return errors;
}

// Routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.get('/api/tasks', (req, res) => {
  const { status } = req.query;
  let result = tasks;
  if (status && VALID_STATUSES.includes(status)) {
    result = tasks.filter(t => t.status === status);
  }
  res.json(result);
});

app.post('/api/tasks', (req, res) => {
  const errors = validateTaskPayload(req.body);
  if (errors.length) return res.status(400).json({ errors });
  const { title, description = '', status = 'pending', dueDate = null } = req.body;
  const task = { id: nanoid(10), title: title.trim(), description, status, dueDate, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  tasks.push(task);
  res.status(201).json(task);
});

app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

app.put('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  const errors = validateTaskPayload(req.body, { partial: false });
  if (errors.length) return res.status(400).json({ errors });
  const { title, description = '', status = 'pending', dueDate = null } = req.body;
  task.title = title.trim();
  task.description = description;
  task.status = status;
  task.dueDate = dueDate;
  task.updatedAt = new Date().toISOString();
  res.json(task);
});

app.patch('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  const errors = validateTaskPayload(req.body, { partial: true });
  if (errors.length) return res.status(400).json({ errors });
  const { title, description, status, dueDate } = req.body;
  if (title !== undefined) task.title = title.trim();
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  if (dueDate !== undefined) task.dueDate = dueDate;
  task.updatedAt = new Date().toISOString();
  res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const idx = tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  const [removed] = tasks.splice(idx, 1);
  res.json(removed);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err); // basic logging
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
