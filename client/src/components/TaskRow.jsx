import React, { useState } from 'react';

const statusColors = {
  'pending': 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'done': 'bg-green-100 text-green-800'
};

export default function TaskRow({ task, onUpdate, onDelete, onEdit }) {
  const [updating, setUpdating] = useState(false);
  const cycleStatus = async () => {
    const order = ['pending', 'in-progress', 'done'];
    const next = order[(order.indexOf(task.status) + 1) % order.length];
    setUpdating(true);
    try {
      await onUpdate(task.id, { status: next });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-2 px-3 py-2 items-start text-sm hover:bg-gray-50">
      <div className="col-span-3 font-medium break-words">{task.title}</div>
      <div className="col-span-3 text-xs text-gray-600 whitespace-pre-line break-words">{task.description}</div>
      <div className="col-span-2">
        <button disabled={updating} onClick={cycleStatus} className={`text-xs px-2 py-1 rounded ${statusColors[task.status]} disabled:opacity-50`}>{task.status}</button>
      </div>
      <div className="col-span-2 text-xs text-gray-600">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</div>
      <div className="col-span-2 flex justify-end gap-2">
        <button onClick={() => onEdit(task)} className="text-xs px-2 py-1 border rounded hover:bg-gray-100">Edit</button>
        <button onClick={() => onDelete(task.id)} className="text-xs px-2 py-1 border rounded text-red-600 hover:bg-red-50">Del</button>
      </div>
    </div>
  );
}
