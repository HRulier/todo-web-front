import { useForm, type FieldValues } from 'react-hook-form';
import styles from './profile.module.scss';
import { useUserProfile, useLogout, useUpdateUserProfile } from '~/hooks/api/auth';
import InputText from '~/components/fields/InputText';
import type { UserProfile } from '~/types/users';
import Button from '~/components/Button';

const Profile = () => {
  const { data: user } = useUserProfile();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      profile: {
        firstName: user?.profile.firstName ?? '',
        lastName: user?.profile.lastName ?? '',
      },
    },
  });
  const { mutate: logout } = useLogout();
  const { mutate: updateUserProfile, isPending, isError, error } = useUpdateUserProfile();

  const handleUpdateProfile = (data: FieldValues) => {
    updateUserProfile(data as UserProfile);
  };

  console.log(isError, error);

  return (
    <div className={styles.content}>
      <h1>Profile</h1>
      <div>
        <p>
          <b>Email:</b> {user?.email}
        </p>
        <form onSubmit={handleSubmit(data => handleUpdateProfile(data))}>
          <InputText
            name="profile.firstName"
            control={control}
            label="Prénom"
            placeholder="Saisisser votre prénom"
            required
          />
          <InputText
            name="profile.lastName"
            control={control}
            label="Nom"
            placeholder="Saisisser votre nom"
            required
          />
          <Button type="submit" isLoading={isPending}>
            Valider
          </Button>
        </form>
      </div>
      <Button variant="outline" onClick={() => logout()}>
        Se déconnecter
      </Button>
    </div>
  );
};

export default Profile;
