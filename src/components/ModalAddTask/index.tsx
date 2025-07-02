import { useRef, forwardRef, useImperativeHandle, type ForwardRefRenderFunction } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { IoCalendarNumberOutline } from 'react-icons/io5';
import InputText from '../fields/InputText';
import InputDate from '../fields/InputDate';
import Button from '../Button';
import styles from './modal-password.module.scss';

import Modal, { type ModalRefProps } from '~/components/Modal';

const ModalAddTask: ForwardRefRenderFunction<ModalRefProps> = (_, ref) => {
  const modalRef = useRef<ModalRefProps>(null);

  const { control, reset, handleSubmit } = useForm({
    defaultValues: {
      description: '',
      startDate: '',
    },
  });

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        modalRef.current?.open();
      },
      close: () => {
        modalRef.current?.close();
      },
    }),
    []
  );

  const handleChangePassword = async (data: FieldValues) => {
    console.log(data);
  };

  return (
    <Modal maxWidth={450} ref={modalRef} handleClose={() => reset()}>
      <div className={styles.content}>
        <h2>Créer une tâche</h2>
        <form onSubmit={handleSubmit(data => handleChangePassword(data))}>
          <InputText
            name="description"
            control={control}
            label="Description"
            placeholder="Saisissez la description de la tâche"
            required
          />
          <InputDate
            name="startDate"
            control={control}
            label="Date de début"
            placeholder="Choisir une date de début"
            icon={<IoCalendarNumberOutline size={20} />}
            required
          />
          <Button type="submit">Valider</Button>
        </form>
      </div>
    </Modal>
  );
};

export default forwardRef(ModalAddTask);
