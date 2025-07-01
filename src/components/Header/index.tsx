import { CgProfile } from 'react-icons/cg';
import { IoMdLogOut } from 'react-icons/io';
import { NavLink } from 'react-router';
import styles from './header.module.scss';
import { useLogout } from '~/hooks/api/auth';

const Header = () => {
  const { mutate: logout } = useLogout();

  return (
    <div className={styles.header}>
      <h1>Loopness - Todo</h1>
      <div className={styles.actions}>
        <NavLink to="/profile">
          <CgProfile size={24} />
        </NavLink>
        <button onClick={() => logout()}>
          <IoMdLogOut size={26} />
        </button>
      </div>
    </div>
  );
};

export default Header;
