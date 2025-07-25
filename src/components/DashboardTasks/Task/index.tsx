import { useEffect, useRef } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { useDebounceCallback } from 'usehooks-ts';
import { IoIosSettings } from 'react-icons/io';
import styles from './task.module.scss';
import { useUpdateTask } from '~/hooks/api/tasks';
import Checkbox from '~/components/fields/Checkbox';
import type { ITag } from '~/types/tags';
import ModalEditTask from '~/components/ModalEditTask';
import type { ModalEditTaskRefProps } from '~/components/ModalEditTask';

interface TaskProps {
  _id: string;
  description: string;
  completed: boolean;
  dueDate: string;
  tags?: ITag[];
}

const debounceApiCall = 600;

const Task = ({ _id, description, completed, dueDate, tags = [] }: TaskProps) => {
  const modalTaskRef = useRef<ModalEditTaskRefProps>(null);
  const { mutate: updateTask } = useUpdateTask();
  const name = `${_id}-completed`;
  const { control, watch, handleSubmit } = useForm({
    defaultValues: {
      [name]: completed,
    },
  });

  const handleUpdateTask = (data: FieldValues) => {
    updateTask({
      _id,
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
    <>
      {' '}
      <ModalEditTask ref={modalTaskRef} />
      <div
        className={styles.task}
        onClick={() => modalTaskRef.current?.openTask({ _id, description, dueDate, tags })}
        role="button"
      >
        <div>
          <Checkbox control={control} name={name} />
        </div>
        <div>
          <p>{description}</p>
          {tags.length > 0 && (
            <div className={styles.tags}>
              {tags.map(tag => (
                <span className={styles.tag} key={tag._id} style={{ backgroundColor: tag.color }}>
                  {tag.label}
                </span>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => modalTaskRef.current?.openTask({ _id, description, dueDate, tags })}>
          <IoIosSettings size={25} />
        </button>
      </div>
    </>
  );
};

export default Task;
