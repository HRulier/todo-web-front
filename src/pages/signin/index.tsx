import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm, type FieldValues } from 'react-hook-form';
import { useNavigate, NavLink } from 'react-router';
import { MdAlternateEmail } from 'react-icons/md';
import styles from './signin.module.scss';
import { useSignIn } from '~/hooks/api/auth';
import InputEmail from '~/components/fields/InputEmail';
import InputPassword from '~/components/fields/InputPassword';
import Button from '~/components/Button';
import SendVerificationButton from '~/components/SendVerificationButton';
import SigninWithGoogle from '~/components/SigninWithGoogle';

const SignIn = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const email = watch('email');
  const { data, mutate: signIn, isSuccess, isError, error, isPending } = useSignIn();
  const statusError = error?.status || null;

  const handleSignin = async (data: FieldValues) => {
    try {
      await signIn(data as { email: string; password: string });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem('token', data.token);
      queryClient.setQueryData(['user-profile'], data.user);
      navigate('/');
    }
  }, [isSuccess]);

  return (
    <div className={styles.signIn}>
      <div className={styles.container}>
        <h2>Connexion</h2>
        <form onSubmit={handleSubmit(data => handleSignin(data))}>
          <InputEmail
            name="email"
            control={control}
            label="Email"
            placeholder="Entrez votre adresse email"
            icon={<MdAlternateEmail />}
            required
          />
          <InputPassword
            name="password"
            control={control}
            label="Mot de passe"
            placeholder="Entrez votre mot de passe"
            required
          />
          <NavLink to="/signup">Créer un compte ?</NavLink>
          <NavLink to="/forgot-password">Mot de passe oublié ?</NavLink>
          <Button type="submit" isLoading={isPending}>
            Envoyer
          </Button>
        </form>
        <SigninWithGoogle href={`${import.meta.env.VITE_API_URL}/auth/google`} />
        {isError && (
          <div className={styles.error}>
            {statusError === 403 && (
              <>
                <p>
                  Votre compte n'est pas vérifié. Vérifiez votre boîte mail ou demandez un nouvel
                  email de vérification.
                </p>
                <SendVerificationButton email={email} />
              </>
            )}
            {statusError === 401 && <p>Email ou mot de passe incorrect.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;
