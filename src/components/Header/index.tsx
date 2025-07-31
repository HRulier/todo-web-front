import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CgProfile } from 'react-icons/cg';
import { FaListUl } from 'react-icons/fa';
import { IoMdLogOut } from 'react-icons/io';
import { NavLink } from 'react-router';
import styles from './header.module.scss';
import { useLogout } from '~/hooks/api/auth';

const Header = () => {
  const { mutate: logout } = useLogout();
  const today = format(new Date(), 'yyyy-MM-dd', { locale: fr });

  return (
    <div className={styles.header}>
      <h1>
        <FaListUl />
        Loopness - Todos
      </h1>
      <div className={styles.actions}>
        <NavLink to={`/?date=${today}`}>Cette semaine</NavLink>
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
