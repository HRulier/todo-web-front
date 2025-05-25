import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useUserProfile } from '~/hooks/api/auth';

const AuthGoogleSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token]);

  const {
    data: user,
    isLoading,
    // isError,
    // error,
  } = useUserProfile({
    enabled: !!token,
  });

  useEffect(() => {
    if (user) navigate('/');
  }, [user]);

  return (
    <div
      style={{
        position: 'fixed',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      {isLoading ? (
        <>
          <div className="spinner" />
          <p>Authentification en cours...</p>
        </>
      ) : (
        <p>Redirection...</p>
      )}
    </div>
  );
};

export default AuthGoogleSuccess;
