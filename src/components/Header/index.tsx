import { CgProfile } from 'react-icons/cg';
import { NavLink } from 'react-router';
import styles from './header.module.scss';

const Header = () => (
  <div className={styles.header}>
    <NavLink to="/profile">
      <CgProfile size={24} />
    </NavLink>
  </div>
);

export default Header;
