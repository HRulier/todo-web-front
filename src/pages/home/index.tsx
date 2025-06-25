import styles from './home.module.scss';
import { useLogout } from '~/hooks/api/auth';

const Home = () => {
  const { mutate: logout } = useLogout();
  return (
    <div className={styles.content}>
      <h1>Home</h1>
      <button onClick={() => logout()}>Se déconnecter</button>
    </div>
  );
};

export default Home;
