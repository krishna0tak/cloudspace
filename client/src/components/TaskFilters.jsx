import React from 'react';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'in-progress', label: 'In-Progress' },
  { key: 'done', label: 'Done' }
];

export default function TaskFilters({ filter, setFilter }) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map(f => (
        <button
          key={f.key}
          onClick={() => setFilter(f.key)}
          className={`px-3 py-1.5 rounded text-sm border ${filter === f.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50'}`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
