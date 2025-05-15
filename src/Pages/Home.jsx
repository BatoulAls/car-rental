import Hero from "../components/Hero";
import BookCar from "../components/BookCar";
import PlanTrip from "../components/PlanTrip";
import AffordableCar from "../components/Affordablecar";
import PickCar from "../components/PickCar";
import Luxurycars from "../components/Luxurycars";
import Banner from "../components/Banner";
import Testimonials from "../components/Testimonials";
import Download from "../components/Download";

import CarBrands from "../components/CarBrands";

import Footer from "../components/Footer";


function Home() {
  return (
    <>
      <Hero />
      <BookCar/>
      <PlanTrip/>
      <AffordableCar/>
      
      <Luxurycars/>
      
      <PickCar/>
      <Banner/>
      <CarBrands/>
      
    
      <Testimonials/>
    
      <Download/>
      
      
     
      <Footer />
    </>
  );
}

export default Home;
