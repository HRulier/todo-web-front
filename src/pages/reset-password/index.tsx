import { useForm } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';
import { NavLink, useParams } from 'react-router';
import styles from './reset-password.module.scss';
import { useResetPassword } from '~/hooks/api/auth';
import InputPassword from '~/components/fields/InputPassword';
import Button from '~/components/Button';

const ResetPassword = () => {
  const { token = '' } = useParams();
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      password: '',
      'confirm-password': '',
    },
  });

  const password = watch('password');

  const { mutate: resetPassword, isSuccess, isError, isPending } = useResetPassword();

  const handleResetPassword = async (data: FieldValues) => {
    try {
      await resetPassword({
        password: data.password,
        token,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.forgotPassword}>
      <div className={styles.container}>
        <h2>Réinitialiser votre mot de passe</h2>
        {token && (
          <form onSubmit={handleSubmit(data => handleResetPassword(data))}>
            <InputPassword
              name="password"
              control={control}
              label="Nouveau mot de passe"
              placeholder="Entrez le nouveau mot de passe"
              rules={{
                required: 'Ce champ est requis',
              }}
            />
            <InputPassword
              name="confirm-password"
              control={control}
              label="Confirmation mot de passe"
              placeholder="Confirmez le nouveau mot de passe"
              rules={{
                required: 'Ce champ est requis',
                validate: value =>
                  value === password || 'Les mots de passe doivent être identiques',
              }}
            />
            {isSuccess && (
              <div className={styles.info}>
                <p className={styles.success}>Votre mot de passe a été réinitialiser</p>
              </div>
            )}
            {isError && (
              <div className={styles.info}>
                <p className={styles.error}>Une erreur est survenu.</p>{' '}
              </div>
            )}
            <NavLink to="/signin">Se connecter ?</NavLink>
            <Button type="submit" isLoading={isPending}>
              Envoyer
            </Button>
          </form>
        )}
        {!token && (
          <>
            <p>Le lien pour réinitialiser votre mot de passe a expiré.</p>
            <NavLink to="/forgot-password">Demander un nouveau lien ?</NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
