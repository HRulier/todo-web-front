import { useLogout } from '~/hooks/api/auth';

const About = () => {
  const { mutate: logout } = useLogout();
  return (
    <>
      <h1>About</h1>
      <button onClick={() => logout()}>Logout</button>
    </>
  );
};

export default About;
