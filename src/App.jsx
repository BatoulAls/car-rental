import "../src/dist/styles.css";
import Navbar from './components/Navbar';
import Home from './Pages/Home';
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Team from "./Pages/Team";
import Models from "./Pages/Models";
import { Route, Routes } from "react-router-dom";
import Reviews from "./Pages/Reviews";
import AllCar from "./Pages/allcar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/team" element={<Team/>}/>
        <Route path="/models" element={<Models/>}/>
        <Route path="/reviews" element={<Reviews/>}/>
        <Route path="all-cars" element={<AllCar/>}/>
      </Routes>
   
    </>
  );
}

export default App;
