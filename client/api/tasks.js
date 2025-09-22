import { randomBytes } from 'crypto';
import { addTask, listTasks, validateTaskPayload } from './_store.js';

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  const { method, url } = req;
  const u = new URL(url, 'http://localhost');

  if (method === 'GET') {
    const status = u.searchParams.get('status');
    return send(res, 200, listTasks(status));
  }

  if (method === 'POST') {
    let body = '';
    for await (const chunk of req) body += chunk;
    try { body = body ? JSON.parse(body) : {}; } catch { return send(res, 400, { errors: ['invalid JSON body'] }); }
    const errors = validateTaskPayload(body);
    if (errors.length) return send(res, 400, { errors });
    const { title, description = '', status = 'pending', dueDate = null } = body;
    const now = new Date().toISOString();
    const task = {
      id: randomBytes(6).toString('hex'),
      title: title.trim(),
      description,
      status,
      dueDate,
      createdAt: now,
      updatedAt: now
    };
    addTask(task);
    return send(res, 201, task);
  }

  res.setHeader('Allow', 'GET,POST');
  return send(res, 405, { error: 'Method Not Allowed' });
}
