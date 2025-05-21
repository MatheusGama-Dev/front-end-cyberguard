import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const PrivateRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Carregando...</p>;
  if (!user) return <Navigate to="/" />;

  return children;
};

export default PrivateRoute;
