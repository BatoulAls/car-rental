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
import Footer from "./components/Footer";


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
        <Route path="/to={`/cars/${carId}/reviews`}" element={<Reviews/>}/>
        <Route path="all-cars" element={<AllCars/>}/>
        <Route path="results" element={<AllCars/>}/>
         <Route path="/car-details/:carId" element={<CarDetails/>}/>
       




      </Routes>
      </div>
       
      <Footer/>

   
    </>
      </QueryClientProvider>
  );
}

export default App;
