import { useForm, type FieldValues } from 'react-hook-form';
import { NavLink } from 'react-router';
import { MdAlternateEmail } from 'react-icons/md';
import styles from './verification-expired.module.scss';
import InputEmail from '~/components/fields/InputEmail';
import Button from '~/components/Button';
import { useResendValidationEmail } from '~/hooks/api/auth';

const verificationExpired = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
    },
  });
  const {
    mutate: resendVerificationEmail,
    isSuccess,
    isPending,
    isError,
  } = useResendValidationEmail();

  const handleSendEmail = async (data: FieldValues) => {
    try {
      await resendVerificationEmail(data.email);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.verificationExpired}>
      <div className={styles.container}>
        <h4>Le lien de confirmation de votre compte a expiré.</h4>
        <form onSubmit={handleSubmit(data => handleSendEmail(data))}>
          <InputEmail
            name="email"
            control={control}
            placeholder="Entrez votre adresse email"
            icon={<MdAlternateEmail />}
            required
          />
          <Button type="submit" isLoading={isPending}>
            Recevoir un nouveau lien
          </Button>
        </form>
        {isSuccess && (
          <p className={styles.success}>
            Un nouvel email de vérification a été envoyé. Veuillez vérifier votre boîte de
            réception.
          </p>
        )}
        {isError && <p className={styles.error}>Une erreur est survenu.</p>}
        <NavLink to="/signin">Me connecter à mon compte ?</NavLink>
      </div>
    </div>
  );
};

export default verificationExpired;
