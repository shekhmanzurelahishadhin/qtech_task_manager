export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  status_label: string;
  created_at: string;
  updated_at: string;
}

export interface TaskStats {
  pending: number;
  in_progress: number;
  completed: number;
  total: number;
}

export interface TaskListResponse {
  data: Task[];
  stats: TaskStats;
  meta: {
    total: number;
    filter: string | null;
  };
}

export interface TaskResponse {
  data: Task;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
}

export type FilterStatus = TaskStatus | 'all';
