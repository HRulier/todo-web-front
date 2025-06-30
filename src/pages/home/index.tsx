import styles from './home.module.scss';
import Button from '~/components/Button';
import { useLogout } from '~/hooks/api/auth';

const Home = () => {
  const { mutate: logout } = useLogout();

  return (
    <div className={styles.content}>
      <h1>Home</h1>
      <Button variant="outline" onClick={() => logout()}>
        Se déconnecter
      </Button>
    </div>
  );
};

export default Home;
