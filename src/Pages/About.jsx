import Footer from "../components/Footer";
import HeroPages from "../components/HeroPages";



function About() {
  return (
    <>
      <section className="about-page">
        <HeroPages name="About" />
        <div className="container">
        </div>
      </section>
      <div className="book-banner">
        <div className="book-banner__overlay"></div>
        <div className="container">
          <div className="text-content">
            <h2>Book a car by getting in touch with us</h2>
            <span>
              <i className="fa-solid fa-phone"></i>
              <h3>(963) 456-7869</h3>
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default About;
