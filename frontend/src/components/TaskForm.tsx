import { useState, useEffect, useRef } from 'react';
import type { Task, TaskFormData } from '../types';
import { STATUS_OPTIONS } from '../utils';

interface Props {
  task?: Task | null;
  onSubmit: (data: TaskFormData) => Promise<boolean>;
  onClose: () => void;
}

const defaultForm: TaskFormData = {
  title: '',
  description: '',
  status: 'pending',
};

export default function TaskForm({ task, onSubmit, onClose }: Props) {
  const [form, setForm] = useState<TaskFormData>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<TaskFormData>>({});
  const titleRef = useRef<HTMLInputElement>(null);
  const isEditing = Boolean(task);

  useEffect(() => {
    if (task) {
      setForm({ title: task.title, description: task.description ?? '', status: task.status });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
    setTimeout(() => titleRef.current?.focus(), 50);
  }, [task]);

  const validate = (): boolean => {
    const next: Partial<TaskFormData> = {};
    if (!form.title.trim()) next.title = 'Title is required.';
    else if (form.title.trim().length > 255) next.title = 'Title must be under 255 characters.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const ok = await onSubmit({ ...form, title: form.title.trim() });
    setSubmitting(false);
    if (ok) onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditing ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1.5 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              ref={titleRef}
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="What needs to be done?"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                ${errors.title ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50 focus:bg-white'}`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Add more details..."
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, status: opt.value })}
                  className={`text-xs font-medium py-2 rounded-xl border transition-all ${
                    form.status === opt.value
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
