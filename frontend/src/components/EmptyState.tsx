import type { FilterStatus } from '../types';

interface Props {
  filter: FilterStatus;
  onClear: () => void;
  onCreate: () => void;
}

export default function EmptyState({ filter, onClear, onCreate }: Props) {
  const isFiltered = filter !== 'all';

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-slate-700 mb-1">
        {isFiltered ? 'No tasks found' : 'No tasks yet'}
      </h3>
      <p className="text-sm text-slate-400 max-w-xs mb-6">
        {isFiltered
          ? `No tasks with "${filter.replace('_', ' ')}" status. Try a different filter.`
          : 'Create your first task to get started.'}
      </p>
      {isFiltered ? (
        <button
          onClick={onClear}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
        >
          Clear filter
        </button>
      ) : (
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Task
        </button>
      )}
    </div>
  );
}
