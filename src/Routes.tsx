import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router';
import { useUserProfile } from './hooks/api/auth';
import SignIn from '~/pages/signin';
import Home from '~/pages/home';
import About from '~/pages/about';

const Redirect = () => {
  const navigate = useNavigate();
  const { data: user } = useUserProfile();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!user && !token) {
      navigate('/signin');
    }
  }, [user]);

  return (
    <div
      style={{
        position: 'fixed',
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <p>Loading...</p>
    </div>
  );
};

const AppRoutes = () => {
  const { data: user } = useUserProfile();

  return (
    <>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          {user && (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
            </>
          )}
          <Route path="*" element={<Redirect />} />
        </Routes>
      </Router>
    </>
  );
};

export default AppRoutes;
