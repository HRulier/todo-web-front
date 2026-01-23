import {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  type ForwardRefRenderFunction,
} from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { IoCalendarNumberOutline } from 'react-icons/io5';
import InputText from '../fields/InputText';
import InputDate from '../fields/InputDate';
import MultipleSelect from '../fields/MultipleSelect';
import Select from '../fields/Select';
import Button from '../Button';
import styles from './modal-password.module.scss';
import { useCreateTask, useUpdateTask, useDeleteTask } from '~/hooks/api/tasks';
import { useGetTags, useCreateTag } from '~/hooks/api/tags';

import Modal, { type ModalRefProps } from '~/components/Modal';
import type { ITask, CreateTaskPayload } from '~/types/tasks';
import type { ITag } from '~/types/tags';
import type { OptionItem } from '~/components/fields/MultipleSelect';

export interface ModalEditTaskRefProps {
  openTask: (task?: {
    _id: string;
    description: string;
    dueDate: string;
    priority: string | null;
    tags: ITag[];
  }) => void;
  open: (date?: string) => void;
  close: () => void;
}

const priorityOptions: OptionItem[] = [
  { value: 'low', label: 'Basse' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'high', label: 'Haute' },
];

const ModalEditTask: ForwardRefRenderFunction<ModalRefProps> = (_, ref) => {
  const [taskId, setTaskId] = useState<string | null>(null);
  const modalRef = useRef<ModalRefProps>(null);
  const { mutate: createTask } = useCreateTask();
  const { mutateAsync: createTag } = useCreateTag();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();

  const { data: tags } = useGetTags();

  const { control, reset, handleSubmit } = useForm({
    defaultValues: {
      description: '',
      dueDate: '',
      tags: [] as OptionItem[],
      priority: null as string | null,
    },
  });

  useImperativeHandle(
    ref,
    () => ({
      open: (date?: string) => {
        reset({
          description: '',
          priority: null,
          dueDate: date,
        });
        setTaskId(null);
        modalRef.current?.open();
      },
      openTask: (task: ITask) => {
        setTaskId(task._id);
        reset({
          description: task.description,
          dueDate: task.dueDate,
          priority: task.priority,
          tags: (task.tags || []).map(tag => ({
            value: tag._id,
            label: tag.label,
            color: tag.color,
          })),
        });
        modalRef.current?.open();
      },
      close: () => {
        modalRef.current?.close();
      },
    }),
    []
  );

  const handleEditTask = (data: FieldValues) => {
    if (taskId) {
      updateTask({
        _id: taskId,
        task: {
          description: data.description,
          dueDate: data.dueDate,
          priority: data.priority,
          tags: (data.tags || []).map((tag: OptionItem) => tag.value),
        },
      });
    } else {
      createTask({
        ...data,
        tags: (data.tags || []).map((tag: OptionItem) => tag.value),
      } as CreateTaskPayload);
    }

    setTaskId(null);
    modalRef.current?.close();
  };

  const optionsTags = tags?.map(tag => ({
    value: tag._id,
    label: tag.label,
    color: tag.color,
  }));

  const createTagOption = async (tagLabel: string): Promise<OptionItem> => {
    try {
      const tag = await createTag(tagLabel);
      if (!tag) throw new Error('Tag not created');
      return {
        value: tag?._id,
        label: tag?.label,
        color: tag?.color,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Tag not created');
    }
  };

  return (
    <Modal maxWidth={450} ref={modalRef} handleClose={() => reset()}>
      <div className={styles.content}>
        {taskId ? <h1>Modifier la tâche</h1> : <h1>Ajouter une tâche</h1>}
        <form onSubmit={handleSubmit(data => handleEditTask(data))}>
          <InputText
            name="description"
            control={control}
            label="Description"
            placeholder="Saisissez la description de la tâche"
            required
          />
          <InputDate
            name="dueDate"
            control={control}
            label="Date de début"
            placeholder="Choisir une date de début"
            icon={<IoCalendarNumberOutline size={20} />}
            required
          />
          <Select
            name="priority"
            control={control}
            options={priorityOptions}
            label="Priorité"
            placeholder="Choisir une priorité"
            // required
          />
          <MultipleSelect
            name="tags"
            control={control}
            options={optionsTags || []}
            label="Categories"
            placeholder="Choisir un/des categories(s)"
            createOption={createTagOption}
            // required
          />
          <div className={styles.actions}>
            <Button type="submit">Valider</Button>
            {taskId && (
              <Button type="button" variant="outline" onClick={() => deleteTask(taskId)}>
                Supprimer
              </Button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default forwardRef(ModalEditTask);
