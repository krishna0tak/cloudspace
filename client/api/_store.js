// Simple in-memory task store for Vercel serverless functions.
// NOTE: This is NOT persistent. Each cold start resets data.

export const VALID_STATUSES = ['pending', 'in-progress', 'done'];

// Module-scoped array (survives warm invocations, lost on cold start)
let tasks = [];

export function listTasks(filterStatus) {
  if (filterStatus && VALID_STATUSES.includes(filterStatus)) {
    return tasks.filter(t => t.status === filterStatus);
  }
  return tasks;
}

export function getTask(id) {
  return tasks.find(t => t.id === id) || null;
}

export function addTask(task) {
  tasks.unshift(task); // newest first
  return task;
}

export function updateTask(id, updates) {
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return null;
  tasks[idx] = { ...tasks[idx], ...updates, updatedAt: new Date().toISOString() };
  return tasks[idx];
}

export function deleteTask(id) {
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return null;
  const [removed] = tasks.splice(idx, 1);
  return removed;
}

export function validateTaskPayload(body, { partial = false } = {}) {
  const errors = [];
  const { title, description, status, dueDate } = body || {};
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
    if (dueDate !== undefined && dueDate !== null && Number.isNaN(Date.parse(dueDate))) errors.push('dueDate must be a valid date string');
  }
  return errors;
}
