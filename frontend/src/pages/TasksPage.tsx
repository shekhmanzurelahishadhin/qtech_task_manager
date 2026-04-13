import { useState } from 'react';
import type { Task, TaskFormData } from '../types';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import StatsBar from '../components/StatsBar';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function TasksPage() {
  const { tasks, stats, filter, loading, error, createTask, updateTask, deleteTask, changeFilter } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleOpenCreate = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleSubmit = async (data: TaskFormData): Promise<boolean> => {
    if (editingTask) {
      const result = await updateTask(editingTask.id, data);
      return Boolean(result);
    }
    const result = await createTask(data);
    return Boolean(result);
  };

  const handleStatusChange = async (id: number, status: Task['status']) => {
    await updateTask(id, { status });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-none">Task Management</h1>
              <p className="text-xs text-slate-500 mt-0.5">Organize your tasks efficiently</p>
            </div>
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">New Task</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Stats */}
        <StatsBar stats={stats} activeFilter={filter} onFilter={changeFilter} />

        {/* Filter label */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-600">
            {filter === 'all' ? 'All Tasks' : `${filter.replace('_', ' ')} tasks`}
            {!loading && (
              <span className="ml-2 text-slate-400 font-normal">({tasks.length})</span>
            )}
          </h2>
          {filter !== 'all' && (
            <button
              onClick={() => changeFilter('all')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Clear filter ×
            </button>
          )}
        </div>

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Task Grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : tasks.length === 0 ? (
          <EmptyState filter={filter} onClear={() => changeFilter('all')} onCreate={handleOpenCreate} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleOpenEdit}
                onDelete={deleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {/* Form Modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
