import React from 'react';
import TaskRow from './TaskRow.jsx';

export default function TaskList({ tasks, onUpdate, onDelete, onEdit }) {
  return (
    <div className="bg-white rounded shadow divide-y">
      <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
        <div className="col-span-3">Title</div>
        <div className="col-span-3">Description</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Due</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>
      {tasks.map(t => (
        <TaskRow key={t.id} task={t} onUpdate={onUpdate} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}
