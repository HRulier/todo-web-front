import { AxiosWithInterceptors } from '../axios';
import type { ITask, CreateTaskPayload, UpdateTaskPayload } from '~/types/tasks';

const getTasks = async (): Promise<ITask[] | null> => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const response = await AxiosWithInterceptors.get(`${import.meta.env.VITE_API_URL}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.tasks;
};

const createTask = async (task: CreateTaskPayload): Promise<ITask | null> => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const response = await AxiosWithInterceptors.post(`${import.meta.env.VITE_API_URL}/tasks`, task, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data.task;
};

const updateTask = async (taskId: string, task: UpdateTaskPayload): Promise<ITask | null> => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const response = await AxiosWithInterceptors.put(
    `${import.meta.env.VITE_API_URL}/tasks/${taskId}`,
    task,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.task;
};

export { getTasks, createTask, updateTask };
