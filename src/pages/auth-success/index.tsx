import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useUserProfile } from '~/hooks/api/auth';

const AuthSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');
  const redirectUrl = params.get('redirectUrl');

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
    if (user) navigate(redirectUrl ? `/${redirectUrl}` : '/');
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

export default AuthSuccess;
