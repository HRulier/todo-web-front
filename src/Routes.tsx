import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  useSearchParams,
  createSearchParams,
} from 'react-router';
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
import Dashboard from '~/pages/dashboard';
import Profile from '~/pages/profile';

const Redirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useUserProfile();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!user && !token) {
      const url: any = {
        pathname: '/signin',
      };
      if (/\?redirect/.test(location.search)) {
        const pathname = location.pathname.replace('/', '');
        url.search = createSearchParams({ redirect: pathname }).toString();
      }
      navigate(url);
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

const CleanRedirectParams = ({ children }: { children: React.ReactNode }) => {
  const [params, setParams] = useSearchParams();
  const { data: user } = useUserProfile();

  useEffect(() => {
    if (user) {
      const newParams = params;
      newParams.delete('redirect');
      setParams(newParams);
    }
  }, [user]);

  return children;
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
                <CleanRedirectParams key="app">
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/home" element={<Home />} />
                      <Route path="/profile" element={<Profile />} />
                    </Routes>
                  </Layout>
                </CleanRedirectParams>
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
