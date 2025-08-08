import "../src/dist/styles.css";

import Home from './Pages/Home';
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Team from "./Pages/Team";
import Models from "./Pages/Models";
import { Route, Routes } from "react-router-dom";
import Reviews from "./Pages/Reviews";
import AllCars from "./Pages/allcars";
import CarDetails from "./Pages/CarDetails";

import AllBrands from "./Pages/AllBrands";
import Vendors from './Pages/Vendors'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import VendorDetails from "./Pages/VendorDetails";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
import ResetPasswordModal from "./components/ResetPasswordModal";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import VendorLayout from "./layouts/VendorLayout";
import UserProfile from "./Pages/UserProfile";
import { AuthProvider } from './context/AuthContext'; 
import BookingPreviewPage from './Pages/BookingPreviewPage';
import BookingDetails from "./Pages/BookingDetails";
// vendors

import AddCar from './Pages/Vendor/AddCar'
import MyCars from './Pages/Vendor/MyCars'

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route
          element={<MainLayout />}
        >
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/team" element={<Team />} />
          <Route path="/models" element={<Models />} />
          <Route path="/cars/:carId/reviews" element={<Reviews />} />
          <Route path="/all-cars" element={<AllCars />} />
          <Route path="/results" element={<AllCars />} />
          <Route path="/car-details/:carId" element={<CarDetails />} />
          <Route path="/vendors/:vendorId" element={<VendorDetails />} />
          <Route path="/all-brands" element={<AllBrands />} />
          <Route path="/cars" element={<AllCars />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/cars/vendors/:vendorId" element={<AllCars />} />
          <Route path="/reset-password/:token" element={<ResetPasswordModal  />} />
          <Route path="/UserProfile" element={<UserProfile  />} />
          <Route path="/preview-booking" element={<BookingPreviewPage />} />
          <Route path="/booking-details/:bookingId" element={<BookingDetails />}/>
         

          

        </Route>


        <Route element={<VendorLayout />}>
          
          
           <Route path="/vendors/MyCars" element={<MyCars />}/>
           <Route path="/vendors/add-car" element={<AddCar/>}/>
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
