import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />; 

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'vendor') return <Navigate to="/vendors/MyCars" replace />;
    if (user.role === 'customer') return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
