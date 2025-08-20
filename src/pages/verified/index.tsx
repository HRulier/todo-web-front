import { NavLink } from 'react-router';
import styles from './verified.module.scss';

const Verified = () => (
  <div className={styles.verified}>
    <div className={styles.container}>
      <h2>Merci d'avoir finaliser votre inscription</h2>
      <NavLink to="/signin">Me connecter à mon compte ?</NavLink>
    </div>
  </div>
);

export default Verified;
