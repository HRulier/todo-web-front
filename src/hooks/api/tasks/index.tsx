import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask, deleteTask, getTasks, updateTask } from '~/api/tasks';
import type {
  ITask,
  QueryParamsGetTasks,
  CreateTaskPayload,
  UpdateTaskPayload,
} from '~/types/tasks';

const useGetTasks = (params: QueryParamsGetTasks) =>
  useQuery({
    queryKey: ['tasks', params],
    queryFn: async (): Promise<ITask[] | null> => getTasks(params),
  });

const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateTaskPayload): Promise<ITask | null> => createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { _id: string; task: UpdateTaskPayload }): Promise<ITask | null> =>
      updateTask(data._id, data.task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_id: string): Promise<{ message: string } | null> => deleteTask(_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export { useGetTasks, useCreateTask, useUpdateTask, useDeleteTask };
