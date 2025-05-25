import { NavLink } from 'react-router';
import { useLogout } from '~/hooks/api/auth';

const Home = () => {
  const { mutate: logout } = useLogout();
  return (
    <>
      <h1>Home</h1>
      <NavLink to="about">About</NavLink>
      <button onClick={() => logout()}>Se déconnecter</button>
    </>
  );
};

export default Home;
