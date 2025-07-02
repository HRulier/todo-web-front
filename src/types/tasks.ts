import type { IUser } from './users';

export interface ITask {
  __id: string;
  description: string;
  date: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  user: IUser;
}

export interface CreateTaskPayload {
  description: string;
  date: string;
}
