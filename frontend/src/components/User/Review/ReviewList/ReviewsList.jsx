import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReviewsByPostId } from '../../../../redux/postAPI';
import { setReviews } from '../../../../redux/reviewSlice';
import './ReviewsList.css';

const ReviewsList = ({ postId }) => {
  const dispatch = useDispatch();
  const { reviews = [], loading, error } = useSelector((state) => state.reviews);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!postId) {
        console.error('postId không hợp lệ hoặc không tồn tại.');
        return;
      }

      try {
        const reviewsData = await getReviewsByPostId(postId);
        dispatch(setReviews(reviewsData));
      } catch (error) {
        console.error('Lỗi khi tải bài đánh giá:', error);
      }
    };

    fetchReviews();
  }, [dispatch, postId]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= rating ? 'filled' : ''}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message || 'Không thể tải đánh giá.'}</p>;

  return (
    <div>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review._id} className="review-item">
            <p><strong>{review.user_id?.username}</strong></p>
            <p>{new Date(review.createdAt).toLocaleString()}</p>
            <p>Comment: {review.comment}</p>
            <div className="stars">{renderStars(review.rating)}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewsList;