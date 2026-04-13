import { useState } from 'react';
import type { Task } from '../types';
import StatusBadge from './StatusBadge';
import { formatRelativeTime } from '../utils';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: Task['status']) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    setDeleting(true);
    await onDelete(task.id);
    setDeleting(false);
  };

  const nextStatus: Record<Task['status'], Task['status']> = {
    pending: 'in_progress',
    in_progress: 'completed',
    completed: 'pending',
  };

  const nextLabel: Record<Task['status'], string> = {
    pending: '▶ Start',
    in_progress: '✓ Complete',
    completed: '↺ Reopen',
  };

  return (
    <div className={`group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${deleting ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 text-base leading-snug truncate">{task.title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{formatRelativeTime(task.updated_at)}</p>
        </div>
        <StatusBadge status={task.status} />
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">{task.description}</p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
        {/* Quick status advance */}
        <button
          onClick={() => onStatusChange(task.id, nextStatus[task.status])}
          className="text-xs font-medium text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-lg px-3 py-1.5 transition-all"
        >
          {nextLabel[task.status]}
        </button>

        <div className="flex-1" />

        {/* Edit */}
        <button
          onClick={() => onEdit(task)}
          className="text-xs font-medium text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg px-3 py-1.5 transition-all"
        >
          Edit
        </button>

        {/* Delete */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className={`text-xs font-medium rounded-lg px-3 py-1.5 transition-all ${
            confirmDelete
              ? 'text-white bg-red-500 hover:bg-red-600'
              : 'text-slate-500 hover:text-red-600 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200'
          }`}
        >
          {confirmDelete ? 'Confirm?' : deleting ? '...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
