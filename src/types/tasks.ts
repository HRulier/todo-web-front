import type { IUser } from './users';

export interface ITask {
  _id: string;
  description: string;
  date: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  user: IUser;
}

export interface QueryParamsGetTasks {
  completed?: boolean;
  minDate?: string; // Format: YYYY-MM-DD
  maxDate?: string; // Format: YYYY-MM-DD
}

export interface CreateTaskPayload {
  description: string;
  date: string;
}

export interface UpdateTaskPayload {
  description?: string;
  date?: string;
  completed?: boolean;
}
