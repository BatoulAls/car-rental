import "../src/dist/styles.css";
import Navbar from './components/Navbar';
import Home from './Pages/Home';
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Team from "./Pages/Team";
import Models from "./Pages/Models";
import { Route, Routes } from "react-router-dom";
import Reviews from "./Pages/Reviews";
import AllCars from "./Pages/allcars";
import CarDetails from "./Pages/CarDetails";
import Footer from "./components/Footer"
import AllBrands from "./Pages/AllBrands";
import Vendors from './Pages/Vendors'



import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import VendorDetails from "./Pages/VendorDetails";

const queryClient = new QueryClient();

function App() {
  return (
        <QueryClientProvider client={queryClient}>
    <>
      <Navbar />
     
      <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/team" element={<Team/>}/>
        <Route path="/models" element={<Models/>}/>
        <Route path="/cars/:carId/reviews" element={<Reviews/>}/>
        <Route path="all-cars" element={<AllCars/>}/>
        <Route path="results" element={<AllCars/>}/>
        <Route path="/car-details/:carId" element={<CarDetails/>}/>
         <Route path="/vendors/:vendorId" element={<VendorDetails/>}/>

        <Route path="/all-brands" element={<AllBrands/>}/>
        <Route path="/cars" element={<AllCars />} />
        <Route path="/Vendors" element={<Vendors/>}/>
       
      </Routes>
      </div>
       
      <Footer/>

   
    </>
      </QueryClientProvider>
  );
}

export default App;
