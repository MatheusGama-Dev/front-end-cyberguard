import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    // Se não tiver token, redireciona para login
    return <Navigate to="/" />;
  }

  return children;
}
