import { useEffect } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { useDebounceCallback } from 'usehooks-ts';
import styles from './task.module.scss';
import { useUpdateTask } from '~/hooks/api/tasks';
import Checkbox from '~/components/fields/Checkbox';

interface TaskProps {
  id: string;
  description: string;
  completed: boolean;
  date?: string;
}

const debounceApiCall = 600;

const Task = ({ id, description, date, completed }: TaskProps) => {
  const { mutate: updateTask } = useUpdateTask();
  const name = `${id}-completed`;
  const { control, watch, handleSubmit } = useForm({
    defaultValues: {
      [name]: completed,
    },
  });

  const handleUpdateTask = (data: FieldValues) => {
    updateTask({
      id,
      task: {
        completed: data[name],
      },
    });
  };

  useEffect(() => {
    const subscription = watch((_, { type }) => {
      if (type === 'change') handleSubmit(debouncedSubmit)();
    });

    return () => subscription.unsubscribe();
  }, [handleSubmit, watch]);

  // Debounce API call
  const debouncedSubmit = useDebounceCallback(handleUpdateTask, debounceApiCall);

  return (
    <div className={styles.task}>
      <div>
        <Checkbox control={control} name={name} />
      </div>
      <div>
        <p>{description}</p>
        {date && <p>{date}</p>}
      </div>
    </div>
  );
};

export default Task;
