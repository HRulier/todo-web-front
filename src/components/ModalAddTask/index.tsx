import { useRef, forwardRef, useImperativeHandle, type ForwardRefRenderFunction } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { IoCalendarNumberOutline } from 'react-icons/io5';
import InputText from '../fields/InputText';
import InputDate from '../fields/InputDate';
import Select from '../fields/Select';
import Button from '../Button';
import styles from './modal-password.module.scss';
import { useCreateTask } from '~/hooks/api/tasks';
import { useGetTags, useCreateTag } from '~/hooks/api/tags';

import Modal, { type ModalRefProps } from '~/components/Modal';
import type { CreateTaskPayload } from '~/types/tasks';
import type { OptionItem } from '~/components/fields/Select/';

export interface ModalAddTaskRefProps {
  open: (date?: string) => void;
  close: () => void;
}

const ModalAddTask: ForwardRefRenderFunction<ModalRefProps> = (_, ref) => {
  const modalRef = useRef<ModalRefProps>(null);
  const { mutate: createTask } = useCreateTask();
  const { mutateAsync: createTag } = useCreateTag();
  const { data: tags } = useGetTags();

  const { control, reset, handleSubmit } = useForm({
    defaultValues: {
      description: '',
      dueDate: '',
      tags: [],
    },
  });

  useImperativeHandle(
    ref,
    () => ({
      open: (date?: string) => {
        reset({
          description: '',
          dueDate: date,
        });
        modalRef.current?.open();
      },
      close: () => {
        modalRef.current?.close();
      },
    }),
    []
  );

  const handleCreateTask = (data: FieldValues) => {
    createTask({
      ...data,
      tags: (data.tags || []).map((tag: OptionItem) => tag.value),
    } as CreateTaskPayload);
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
        <h2>Créer une tâche</h2>
        <form onSubmit={handleSubmit(data => handleCreateTask(data))}>
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
            name="tags"
            control={control}
            options={optionsTags || []}
            label="Categories"
            placeholder="Choissir un/des categories(s)"
            createOption={createTagOption}
            required
          />
          <Button type="submit">Valider</Button>
        </form>
      </div>
    </Modal>
  );
};

export default forwardRef(ModalAddTask);
