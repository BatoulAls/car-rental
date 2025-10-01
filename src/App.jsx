import "../src/dist/styles.css";
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import VendorLayout from './layouts/VendorLayout';

import PrivateRoute from './routes/PrivateRoute';
import RoleBasedHome from './routes/RoleBasedHome';

import Home from './Pages/Home';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Team from './Pages/Team';
import Models from './Pages/Models';
import AllCars from './Pages/allcars';
import CarDetails from './Pages/CarDetails';
import AllBrands from './Pages/AllBrands';
import Vendors from './Pages/Vendors';
import VendorDetails from './Pages/VendorDetails';
import ResetPasswordModal from './components/ResetPasswordModal';

import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';

import UserProfile from './Pages/UserProfile';
import BookingPreviewPage from './Pages/BookingPreviewPage';
import BookingDetails from './Pages/BookingDetails';
import Reviews from './Pages/Reviews';

import AddCar from './Pages/Vendor/AddCar';
import MyCars from './Pages/Vendor/MyCars';
import VendorsCarDetails from './Pages/Vendor/VendorsCarDetails';
import EditCar from './Pages/Vendor/EditCar';
import VendorBookings from "./Pages/Vendor/VendorBookings";
import VendorBookingDetails from "./Pages/Vendor/VendorBookingDetails";
import VendorProfile from "./Pages/Vendor/VendorProfile"; 
import VendorDashboard from "./Pages/Vendor/VendorDashboard";

const queryClient = new QueryClient();

function App() {
  return (
    
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Routes>

          <Route element={<MainLayout />}>

            <Route path="/" element={<RoleBasedHome />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/team" element={<Team />} />
            <Route path="/models" element={<Models />} />
            <Route path="/all-cars" element={<AllCars />} />
            <Route path="/results" element={<AllCars />} />
            <Route path="/car-details/:carId" element={<CarDetails />} />
            <Route path="/vendors/:vendorId" element={<VendorDetails />} />
            <Route path="/all-brands" element={<AllBrands />} />
            <Route path="/cars" element={<AllCars />} />
            <Route path="/cars/vendors/:vendorId" element={<AllCars />} />
            <Route path="/Companies" element={<Vendors />} />
            <Route path="/reset-password/:token" element={<ResetPasswordModal />} />

            <Route
              path="/UserProfile"
              element={
                <PrivateRoute allowedRoles={['customer']}>
                  <UserProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/preview-booking"
              element={
                <PrivateRoute allowedRoles={['customer']}>
                  <BookingPreviewPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/booking-details/:bookingId"
              element={
                <PrivateRoute allowedRoles={['customer']}>
                  <BookingDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/cars/:carId/reviews"
              element={
                <PrivateRoute allowedRoles={['customer']}>
                  <Reviews />
                </PrivateRoute>
              }
            />
          </Route>

          <Route element={<VendorLayout />}>
            {/* ✅ NEW ROUTE: Vendor Profile */}
            <Route
              path="/vendors/Profile"
              element={
                <PrivateRoute allowedRoles={['vendor']}>
                  <VendorProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendors/VendorDashboard"
              element={
                <PrivateRoute allowedRoles={['vendor']}>
                  <VendorDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendors/MyCars"
              element={
                <PrivateRoute allowedRoles={['vendor']}>
                  <MyCars />
                </PrivateRoute>
              }
            />
              <Route
                path="/vendorsbooking-details/:bookingId"
                element={
                  <PrivateRoute allowedRoles={['vendor']}>
                    <VendorBookingDetails />
                  </PrivateRoute>
                }
              />
            <Route
              path="/vendors/add-car"
              element={
                <PrivateRoute allowedRoles={['vendor']}>
                  <AddCar />
                </PrivateRoute>
              }
            />
            <Route
              path="/VendorsCarDetails/:carId"
              element={
                <PrivateRoute allowedRoles={['vendor']}>
                  <VendorsCarDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendors/edit-car/:carId"
              element={
                <PrivateRoute allowedRoles={['vendor']}>
                  <EditCar />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendors/VendorBookings"
              element={
                <PrivateRoute allowedRoles={['vendor']}>
                  <VendorBookings/>
                </PrivateRoute>
              }
            />
          </Route>
          
          <Route element={<AuthLayout />}>
            <Route
              path="/login"
              element={
                <GuestOnly>
                  <LoginPage />
                </GuestOnly>
              }
            />
            <Route
              path="/register"
              element={
                <GuestOnly>
                  <RegisterPage />
                </GuestOnly>
              }
            />
          </Route>

        </Routes>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;


function GuestOnly({ children }) {
  const { isAuthenticated, loading, user } = useAuth();

  console.log('🔒 GuestOnly: Rendering with state:', {
    loading,
    isAuthenticated,
    userRole: user?.role,
    hasUser: !!user
  });

  if (loading || isAuthenticated === null) {
    console.log('⏳ GuestOnly: Still loading auth...');
    return (
      <div className="auth-loading" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      }}>
        <div>Checking authentication...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    console.log('✅ GuestOnly: User is authenticated, redirecting...');
    return <RoleBasedHome />;
  }

  console.log('👤 GuestOnly: User is guest, showing children');
  return children;
}