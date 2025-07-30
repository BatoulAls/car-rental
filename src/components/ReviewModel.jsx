import React from 'react';
import InputField from './InputField';
import SubmitButton from './SubmitButton';

const ReviewModel = ({
  car,
  rating,
  comment,
  onRatingChange,
  onCommentChange,
  onSubmit,
  onCancel,
  message,
}) => {
  return (
    <>
      <h2 className="title-Booking">
        Write a Review for {car.brand} {car.model}
      </h2>

      <InputField
        label="Rating"
        id="reviewRating"
        name="reviewRating"
        value={rating}
        onChange={(e) => onRatingChange(parseInt(e.target.value))}
        type="select"
        options={[
          { value: 1, label: '1 Star' },
          { value: 2, label: '2 Stars' },
          { value: 3, label: '3 Stars' },
          { value: 4, label: '4 Stars' },
          { value: 5, label: '5 Stars' },
        ]}
      />

      <InputField
        label="Comment"
        id="reviewComment"
        name="reviewComment"
        value={comment}
        onChange={onCommentChange}
        placeholder="Share your experience..."
        type="textarea"
      />

      {message && <p className="review-message">{message}</p>}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <SubmitButton text="Cancel" onClick={onCancel} className="cancel-review-btn" />
        <SubmitButton text="Submit Review" onClick={onSubmit} className="submit-review-btn" />
      </div>
    </>
  );
};

export default ReviewModel;
