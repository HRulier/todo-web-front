import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask, getTasks, updateTask } from '~/api/tasks';
import type { CreateTaskPayload, ITask, UpdateTaskPayload } from '~/types/tasks';

const useGetTasks = () =>
  useQuery({
    queryKey: ['tasks'],
    queryFn: async (): Promise<ITask[] | null> => getTasks(),
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
    mutationFn: async (data: { id: string; task: UpdateTaskPayload }): Promise<ITask | null> =>
      updateTask(data.id, data.task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export { useGetTasks, useCreateTask, useUpdateTask };
