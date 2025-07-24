import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ITag } from '~/types/tags';
import { getTags, createTag } from '~/api/tags';

const useGetTags = () =>
  useQuery({
    queryKey: ['tags'],
    queryFn: async (): Promise<ITag[] | null> => getTags(),
  });

const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tagLabel: string): Promise<ITag | null> => createTag(tagLabel),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};

export { useGetTags, useCreateTag };
