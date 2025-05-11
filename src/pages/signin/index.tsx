import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm, type FieldValues } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { MdAlternateEmail } from 'react-icons/md';
import { useSignIn } from '~/hooks/api/auth';
import InputText from '~/components/fields/InputText';
import InputPassword from '~/components/fields/InputPassword';

const SignIn = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: 'hugo.rulier2@gmail.com',
      password: 'testtest!2025',
    },
  });

  const { data, mutate: signIn, isSuccess } = useSignIn();

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
    <form onSubmit={handleSubmit(data => handleSignin(data))}>
      <InputText
        name="email"
        control={control}
        label="Email"
        placeholder="Entrez votre adresse email"
        type="email"
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
      <input type="submit" />
    </form>
  );
};

export default SignIn;
