import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { taskService, extractErrorMessage } from '../services/taskService';
import type { Task, TaskStats, TaskFormData, FilterStatus } from '../types';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({ pending: 0, in_progress: 0, completed: 0, total: 0 });
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (status: FilterStatus = filter) => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.getAll(status);
      setTasks(response.data);
      setStats(response.stats);
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTasks(filter);
  }, [filter]);

  const createTask = async (payload: TaskFormData): Promise<Task | null> => {
    try {
      const task = await taskService.create(payload);
      toast.success('Task created!');
      await fetchTasks(filter);
      return task;
    } catch (err) {
      toast.error(extractErrorMessage(err));
      return null;
    }
  };

  const updateTask = async (id: number, payload: Partial<TaskFormData>): Promise<Task | null> => {
    try {
      const task = await taskService.update(id, payload);
      toast.success('Task updated!');
      await fetchTasks(filter);
      return task;
    } catch (err) {
      toast.error(extractErrorMessage(err));
      return null;
    }
  };

  const deleteTask = async (id: number): Promise<boolean> => {
    try {
      await taskService.delete(id);
      toast.success('Task deleted.');
      await fetchTasks(filter);
      return true;
    } catch (err) {
      toast.error(extractErrorMessage(err));
      return false;
    }
  };

  const changeFilter = (newFilter: FilterStatus) => {
    setFilter(newFilter);
  };

  return {
    tasks,
    stats,
    filter,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    changeFilter,
  };
}
