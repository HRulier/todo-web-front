import { useForm, type FieldValues } from 'react-hook-form';
import { NavLink } from 'react-router';
import { MdAlternateEmail } from 'react-icons/md';
import styles from './forgot-password.module.scss';
import { useForgotPassword } from '~/hooks/api/auth';
import InputEmail from '~/components/fields/InputEmail';
import Button from '~/components/Button';

const ForgotPassword = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
    },
  });
  const { mutate: forgotPassword, isSuccess, isError, isPending } = useForgotPassword();

  const handleSignin = async (data: FieldValues) => {
    try {
      await forgotPassword(data.email);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.forgotPassword}>
      <div className={styles.container}>
        <h2>Mot de passe oublié</h2>
        <form onSubmit={handleSubmit(data => handleSignin(data))}>
          <InputEmail
            name="email"
            control={control}
            label="Email"
            placeholder="Entrez votre adresse email"
            icon={<MdAlternateEmail />}
            required
          />
          {isSuccess && (
            <div className={styles.info}>
              <p className={styles.success}>
                Un email contenant un lien pour changer de mot de passe vous a été envoyé. Vous
                disposez d'une heure pour utiliser ce lien.
              </p>
            </div>
          )}
          {isError && (
            <div className={styles.info}>
              <p className={styles.error}>Une erreur est survenu.</p>
            </div>
          )}
          <NavLink to="/signin">Se connecter ?</NavLink>
          <Button type="submit" isLoading={isPending}>
            Envoyer
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
