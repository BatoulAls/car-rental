
import HeroPages from "../components/HeroPages";


function Team() {
  
  return (
    <>
      <section className="team-page">
        <HeroPages name="Our Team" />
        <div className="cotnainer">
          
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

export default Team;
