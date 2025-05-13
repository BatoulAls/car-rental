import Hero from "../components/Hero";
import BookCar from "../components/BookCar";
import PlanTrip from "../components/PlanTrip";
import PickCar from "../components/PickCar";
import Banner from "../components/Banner";
import Testimonials from "../components/Testimonials";
import Download from "../components/Download";

import Footer from "../components/Footer";


function Home() {
  return (
    <>
      <Hero />
      <BookCar/>
      <PlanTrip/>
      <PickCar/>
      <Banner/>
      <Download/>
      <Testimonials/>
      
     
      <Footer />
    </>
  );
}

export default Home;
