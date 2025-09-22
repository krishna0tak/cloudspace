import React, { useEffect, useState, useCallback } from 'react';
import TaskForm from './TaskForm.jsx';
import TaskFilters from './TaskFilters.jsx';
import TaskList from './TaskList.jsx';

const STATUSES = ['pending', 'in-progress', 'done'];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = filter !== 'all' ? `?status=${filter}` : '';
      const res = await fetch(`/api/tasks${q}`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (task) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    if (!res.ok) throw new Error('Failed to create task');
    const created = await res.json();
    setTasks(prev => [created, ...prev]);
  };

  const updateTask = async (id, updates) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update task');
    const updated = await res.json();
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
  };

  const deleteTask = async (id) => {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete task');
    await res.json();
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const startEdit = (task) => setEditingTask(task);
  const cancelEdit = () => setEditingTask(null);

  const handleSubmit = async (data) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
      setEditingTask(null);
    } else {
      await createTask(data);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Task Manager</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <TaskForm
            onSubmit={handleSubmit}
            editingTask={editingTask}
            onCancelEdit={cancelEdit}
          />
        </div>
        <div className="md:col-span-2 space-y-4">
          <TaskFilters filter={filter} setFilter={setFilter} />
          {loading && <div className="text-sm text-gray-500">Loading...</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}
          <TaskList
            tasks={tasks}
            onUpdate={updateTask}
            onDelete={deleteTask}
            onEdit={startEdit}
          />
          {!loading && tasks.length === 0 && (
            <div className="text-sm text-gray-500 border rounded p-4">No tasks found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
