import React, { useEffect, useState } from 'react';

const initialState = { title: '', description: '', status: 'pending', dueDate: '' };

export default function TaskForm({ onSubmit, editingTask, onCancelEdit }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState(null);
  const isEditing = !!editingTask;

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description || '',
        status: editingTask.status,
        dueDate: editingTask.dueDate ? editingTask.dueDate.substring(0,10) : ''
      });
    } else {
      setForm(initialState);
    }
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        dueDate: form.dueDate || null
      });
      if (!isEditing) setForm(initialState);
    } catch (err) {
      setError(err.message || 'Failed to save task');
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold">{isEditing ? 'Edit Task' : 'New Task'}</h2>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input name="title" value={form.title} onChange={handleChange} className="w-full border rounded px-2 py-1 focus:ring focus:outline-none" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows="3" className="w-full border rounded px-2 py-1 focus:ring focus:outline-none" />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-2 py-1 focus:ring focus:outline-none">
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Due Date</label>
            <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className="w-full border rounded px-2 py-1 focus:ring focus:outline-none" />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm">{isEditing ? 'Update' : 'Create'}</button>
        {isEditing && <button type="button" onClick={onCancelEdit} className="border px-3 py-1.5 rounded text-sm">Cancel</button>}
      </div>
    </form>
  );
}
