import React from 'react';
import { Link } from 'react-router-dom';
import defaultAvatar from '../images/testimonials/img_avatar.png';   

const renderStars = (rating) => {
  const stars = [];
  const numericRating = parseFloat(rating) || 0;
  const fullStars = Math.floor(numericRating);
  const hasHalfStar = numericRating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<span key={i} className="filled-star">★</span>);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<span key={i} className="half-filled-star">★</span>);
    } else {
      stars.push(<span key={i} className="empty-star">★</span>);
    }
  }
  return stars;
};

const CarReviews = ({
  reviews,
  carId,
  displayLimit = 2, 
  showReadMoreButton = true, 
  readMoreLinkPath = `/cars/${carId}/reviews`, 
  title = "Customer Reviews" 
}) => {
  const displayedReviews = reviews?.slice(0, displayLimit) || [];
  const hasMoreReviews = (reviews?.length ?? 0) > displayLimit;

  return (
    <>
      {(reviews?.length ?? 0) > 0 ? (
        <div className="reviews-section1">
          <h3 className="section-title1">{title}</h3>
          <div className="reviews-list1">
            {displayedReviews.map((review) => (
              <div key={review.id} className="review1">
                <div className="review-header1">
                  <div className="review-user1">
                    <img
                      src={review.user?.photo || defaultAvatar}
                      alt={review.user?.username || 'Anonymous User'}
                      className="user-avatar" 
                    />
                    <h3>{review.user?.username || 'Anonymous'}</h3>
                  </div>
                  <div className="review-rating1">
                    {renderStars(review.rating ?? 0)}
                  </div>
                </div>
                <p className="review-comment1">{review.comment ?? 'No comment provided.'}</p>
                <div className="review-date1">
                  {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            ))}
          </div>
          {showReadMoreButton && hasMoreReviews && (
            <div className="read-more-reviews">
              <Link to={readMoreLinkPath}>Read More Reviews</Link>
            </div>
          )}
        </div>
      ) : (
        <div className="reviews-section1">
          <h3 className="section-title1">{title}</h3>
          <p>No reviews available yet.</p>
        </div>
      )}
    </>
  );
};

export default CarReviews;