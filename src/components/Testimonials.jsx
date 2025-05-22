import React from "react";
import { useQuery } from "@tanstack/react-query";
import defaultProfileImg from "../images/testimonials/img_avatar.png";


const fetchReviewData = async () => {
  const res = await fetch("http://localhost:5050/api/home");
  if (!res.ok) throw new Error("error");
  return res.json();
};

function TestimonialsContainer() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["reviewData"],
    queryFn: fetchReviewData,
  });

  const reviews = data?.reviews || [];


  if (isLoading) return <p>Loading cars...</p>;
  if (error) return <p>Error: {error.message}</p>;

 return(
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonials-content">
          <div className="testimonials-content__title">
            <h4>What Our Customers Say</h4>
            <h2>Client's Testimonials</h2>
            <p>
              Discover the positive impact we've made on the our clients by
              reading through their testimonials. Our clients have experienced
              our service and results, and they're eager to share their
              positive experiences with you.
            </p>
          </div>

          <div className="all-testimonials">
            {reviews.length === 0 ? (
              <p>No testimonials available.</p>
            ) : (
              reviews.map((review) => (
                <div className="all-testimonials__box" key={review.id}>
                  <span className="quotes-icon">
                    <i className="fa-solid fa-quote-right"></i>
                  </span>
                  <p>"{review.comment}"</p>
                  <div className="all-testimonials__box__name">
                    <div className="all-testimonials__box__name__profile">
                      <img
                        src={defaultProfileImg}
                        alt={review.user?.username || "user_img"}
                      />
                      <span>
                        <h4>{review.user?.username || "Anonymous"}</h4>
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsContainer;
