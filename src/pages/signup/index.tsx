import { useEffect } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { NavLink } from 'react-router';
import { MdAlternateEmail } from 'react-icons/md';
import styles from './signup.module.scss';
import { useSignUp } from '~/hooks/api/auth';
import InputEmail from '~/components/fields/InputEmail';
import InputText from '~/components/fields/InputText';
import InputPassword from '~/components/fields/InputPassword';
import Button from '~/components/Button';
import SendVerificationButton from '~/components/SendVerificationButton';

const SignUp = () => {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      profile: {
        firstName: '',
        lastName: '',
      },
    },
  });
  const password = watch('password');
  const email = watch('email');

  const { mutate: signUp, isSuccess, isError, isPending, error } = useSignUp();
  const statusError = error?.status || null;

  const handleSignUp = async (data: FieldValues) => {
    try {
      await signUp(data as { email: string; password: string });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      console.log('done');
    }
  }, [isSuccess]);

  return (
    <div className={styles.signIn}>
      <div className={styles.container}>
        <h2>Créer un compte</h2>
        <form onSubmit={handleSubmit(data => handleSignUp(data))}>
          <InputEmail
            name="email"
            control={control}
            label="Email"
            placeholder="Entrez votre adresse email"
            icon={<MdAlternateEmail />}
            required
          />
          <InputText
            name="profile.firstName"
            control={control}
            label="Prénom"
            placeholder="Entrez votre prénom"
            required
          />
          <InputText
            name="profile.lastName"
            control={control}
            label="Nom"
            placeholder="Entrez votre nom"
            required
          />
          <InputPassword
            name="password"
            control={control}
            label="Mot de passe"
            placeholder="Entrez votre mot de passe"
            required
          />
          <InputPassword
            name="confirmPassword"
            control={control}
            label="Confirmation mot de passe"
            placeholder="Confirmez le nouveau mot de passe"
            rules={{
              required: 'Ce champ est requis',
              validate: value => value === password || 'Les mots de passe doivent être identiques',
            }}
          />
          <NavLink to="/signin">Se connecter ?</NavLink>
          <Button type="submit" isLoading={isPending}>
            Envoyer
          </Button>
        </form>
        {isError && statusError === 422 && (
          <div className={styles.error}>
            <p>Cette adresse email est déjà lié à un compte.</p>
          </div>
        )}
        {isSuccess && (
          <div className={styles.success}>
            <p>
              Compte a été créé avec succès !<br />
              Un email de vérification vous a été envoyé à : {email}
            </p>
            <p>
              Cliquez sur le lien de vérification dans l'email pour finaliser votre inscription.
            </p>
            <SendVerificationButton email={email} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
