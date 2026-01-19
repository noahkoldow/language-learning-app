// Auth Guard Component
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { Loading } from '../UI/Loading';

export function AuthGuard({ children }) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AuthGuard;
