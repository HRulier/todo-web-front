import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router';
import { useUserProfile } from './hooks/api/auth';
import Layout from './components/Layout';
import AuthGoogleSuccess from './pages/auth-google-succes';
import SignIn from '~/pages/signin';
import SignUp from '~/pages/signup';
import ForgotPassword from '~/pages/forgot-password';
import ResetPassword from '~/pages/reset-password';
import Verified from '~/pages/verified';
import VerificationExpired from '~/pages/verification-expired';
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
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verified" element={<Verified />} />
          <Route path="/verification-expired" element={<VerificationExpired />} />
          <Route path="/auth-google-success" element={<AuthGoogleSuccess />} />

          {user && (
            <Route
              path="*"
              element={
                <Layout key="app">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                  </Routes>
                </Layout>
              }
            />
          )}
          <Route path="*" element={<Redirect />} />
        </Routes>
      </Router>
    </>
  );
};

export default AppRoutes;
