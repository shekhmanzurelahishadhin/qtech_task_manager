import axios, { AxiosError } from 'axios';
import type { Task, TaskListResponse, TaskResponse, TaskFormData, FilterStatus } from '../types';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for error normalization
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      return Promise.reject(error);
    }
    if (error.request) {
      return Promise.reject(new Error('Network error — please check your connection.'));
    }
    return Promise.reject(new Error('An unexpected error occurred.'));
  }
);

export const taskService = {
  getAll: async (status?: FilterStatus): Promise<TaskListResponse> => {
    const params: Record<string, string> = {};
    if (status && status !== 'all') params.status = status;
    const { data } = await api.get<TaskListResponse>('/tasks', { params });
    return data;
  },

  getById: async (id: number): Promise<Task> => {
    const { data } = await api.get<TaskResponse>(`/tasks/${id}`);
    return data.data;
  },

  create: async (payload: TaskFormData): Promise<Task> => {
    const { data } = await api.post<TaskResponse>('/tasks', payload);
    return data.data;
  },

  update: async (id: number, payload: Partial<TaskFormData>): Promise<Task> => {
    const { data } = await api.put<TaskResponse>(`/tasks/${id}`, payload);
    return data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};

export function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as { message?: string; errors?: Record<string, string[]> };
    if (data.errors) {
      return Object.values(data.errors).flat().join(' ');
    }
    return data.message || 'Something went wrong.';
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong.';
}

export default api;
