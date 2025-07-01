import { useRef, forwardRef, useImperativeHandle, type ForwardRefRenderFunction } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import InputPassword from '../fields/InputPassword';
import Button from '../Button';
import styles from './modal-password.module.scss';

import Modal, { type ModalRefProps } from '~/components/Modal';
import { useChangeUserPassword } from '~/hooks/api/auth';
import type { ChangePasswordPayload } from '~/types/users';

const ModalPassword: ForwardRefRenderFunction<ModalRefProps> = (_, ref) => {
  const modalRef = useRef<ModalRefProps>(null);
  const { mutate: changeUserPassword, isPending, isError, error } = useChangeUserPassword();
  const errorMessage = isError
    ? (error as any)?.response?.data?.message || 'Un erreur est survenue'
    : null;

  const { control, watch, reset, handleSubmit } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const newPassword = watch('newPassword');

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmNewPassword, ...payload } = data;
    await changeUserPassword(payload as ChangePasswordPayload);
  };

  return (
    <Modal maxWidth={450} ref={modalRef} handleClose={() => reset()}>
      <div className={styles.content}>
        <h2>Changer mon mot de passe.</h2>
        <form onSubmit={handleSubmit(data => handleChangePassword(data))}>
          <InputPassword
            name="currentPassword"
            control={control}
            label="Mot de passe actuel"
            placeholder="Entrez votre mot de passe actuel"
            required
          />
          <InputPassword
            name="newPassword"
            control={control}
            label="Nouveau mot de passe"
            placeholder="Entrez votre nouveau mot de passe"
            required
          />
          <InputPassword
            name="confirmNewPassword"
            control={control}
            label="Confirmation du nouveau mot de passe"
            placeholder="Confirmez le nouveau mot de passe"
            rules={{
              required: 'Ce champ est requis',
              validate: value =>
                value === newPassword || 'Les nouveaux mots de passe doivent être identiques',
            }}
          />
          {errorMessage && (
            <div className={styles.error}>
              <p>{errorMessage}</p>
            </div>
          )}
          <Button type="submit" isLoading={isPending}>
            Valider
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default forwardRef(ModalPassword);
