import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Home from '../Pages/Home';

const RoleBasedHome = () => {
  const { user, loading, isAuthenticated } = useAuth();

  console.log('🏠 RoleBasedHome: Rendering with state:', {
    loading,
    isAuthenticated,
    userRole: user?.role,
    hasUser: !!user
  });

  if (loading || isAuthenticated === null) {
    console.log('⏳ RoleBasedHome: Showing loading...');
    return (
      <div className="page-loading" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log('👤 RoleBasedHome: Showing Home for guest');
    return <Home />;
  }

  if (user.role === 'vendor') {
    console.log('🏢 RoleBasedHome: Redirecting vendor to MyCars');
    return <Navigate to="/vendors/VendorDashboard" replace />;
  }
  
  if (user.role === 'customer') {
    console.log('🛒 RoleBasedHome: Showing Home for customer');
    return <Home />;
  }

  console.log('❓ RoleBasedHome: Unknown role, showing Home');
  return <Home />;
};

export default RoleBasedHome;