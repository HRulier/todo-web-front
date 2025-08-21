import { useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm, type FieldValues } from 'react-hook-form';
import { useNavigate, NavLink, useSearchParams } from 'react-router';
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
  const [params] = useSearchParams();
  const redirect = params.get('redirect');
  const queryClient = useQueryClient();
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const email = watch('email');
  const { data: dataSignIn, mutate: signIn, isSuccess, isError, error } = useSignIn();

  const statusError = error?.status || null;

  const handleSignin = async (data: FieldValues) => {
    try {
      await signIn({
        email,
        password: data.password,
      } as { email: string; password: string });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem('token', dataSignIn.token);
      queryClient.setQueryData(['user-profile'], dataSignIn.user);
      navigate(redirect ? `/${redirect}` : '/');
    }
  }, [isSuccess]);

  const signinWithGoogleUrl = useMemo(() => {
    let url = `${import.meta.env.VITE_API_URL}/auth/google`;
    const tzid = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const params = new URLSearchParams();
    if (redirect) params.append('redirectUrl', redirect);
    params.append('timezone', tzid);
    url += `?${params.toString()}`;
    return url;
  }, [redirect]);

  return (
    <div className={styles.signIn}>
      <div className={styles.container}>
        <h2>Bienvenue</h2>
        <SigninWithGoogle
          href={signinWithGoogleUrl}
          buttonText="Connexion / Inscription avec Google"
        />
        <hr />
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
          <Button type="submit">Se connecter</Button>
        </form>
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
        <div className={styles.containerLinks}>
          <NavLink to="/signup">Créer un compte ?</NavLink>
          <NavLink to="/forgot-password">Mot de passe oublié ?</NavLink>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
