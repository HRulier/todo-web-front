import styles from './profile.module.scss';
import { useUserProfile, useLogout } from '~/hooks/api/auth';

const Profile = () => {
  const { mutate: logout } = useLogout();
  const { data: user } = useUserProfile();

  console.log(user);

  return (
    <div className={styles.content}>
      <h1>Profile</h1>
      <div>
        <p>
          <b>Email:</b> {user?.email}
        </p>
      </div>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

export default Profile;
