import type { IUser } from './users';
import type { ITag } from './tags';

export interface ITask {
  _id: string;
  description: string;
  dueDate: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  user: IUser;
  position: number;
  tags: ITag[];
}

export interface QueryParamsGetTasks {
  completed?: boolean;
  minDate?: string; // Format: YYYY-MM-DD
  maxDate?: string; // Format: YYYY-MM-DD
}

export interface CreateTaskPayload {
  description: string;
  dueDate: string;
}

export interface UpdateTaskPayload {
  description?: string;
  dueDate?: string;
  completed?: boolean;
  position?: number;
}
