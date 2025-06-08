
import HeroPages from "../components/HeroPages";


function Models() {
  return (
    <>
      <section className="models-section">
        <HeroPages name="Car Models" />
        <div className="container">
          <div className="models-div">
          
          </div>
        </div>
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
       
      </section>
    </>
  );
}

export default Models;
