import { AxiosWithInterceptors } from '../axios';
import type { ITag } from '~/types/tags';

const getTags = async (): Promise<ITag[] | null> => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const response = await AxiosWithInterceptors.get(`${import.meta.env.VITE_API_URL}/tags`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.tags;
};

const createTag = async (tagLabel: string): Promise<ITag | null> => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const response = await AxiosWithInterceptors.post(
    `${import.meta.env.VITE_API_URL}/tags`,
    {
      label: tagLabel,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.tag;
};

export { getTags, createTag };
