import { getTask, updateTask, deleteTask, validateTaskPayload } from '../_store.js';

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  const { method, url } = req;
  const u = new URL(url, 'http://localhost');
  const parts = u.pathname.split('/');
  const id = parts[parts.length - 1];
  const task = getTask(id);

  if (method === 'GET') {
    if (!task) return send(res, 404, { error: 'Task not found' });
    return send(res, 200, task);
  }

  if (method === 'PATCH' || method === 'PUT') {
    if (!task) return send(res, 404, { error: 'Task not found' });
    let body = '';
    for await (const chunk of req) body += chunk;
    try { body = body ? JSON.parse(body) : {}; } catch { return send(res, 400, { errors: ['invalid JSON body'] }); }
    const partial = method === 'PATCH';
    const errors = validateTaskPayload(body, { partial });
    if (errors.length) return send(res, 400, { errors });
    const now = new Date().toISOString();
    const updated = updateTask(id, { ...body, updatedAt: now });
    return send(res, 200, updated);
  }

  if (method === 'DELETE') {
    if (!task) return send(res, 404, { error: 'Task not found' });
    const removed = deleteTask(id);
    return send(res, 200, removed);
  }

  res.setHeader('Allow', 'GET,PATCH,PUT,DELETE');
  return send(res, 405, { error: 'Method Not Allowed' });
}
