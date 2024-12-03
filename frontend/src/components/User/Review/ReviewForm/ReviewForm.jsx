import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { createReview } from '../../../../redux/postAPI';
import { useSelector } from 'react-redux';
import './ReviewForm.css';

const ReviewForm = () => {
  const { id } = useParams();
  const [postId, setPostId] = useState(id);
  const [rating, setRating] = useState(0); // Default rating
  const [hoveredRating, setHoveredRating] = useState(null); // Hover state
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const token = currentUser?.accessToken;
  const user_id = currentUser?._id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!postId || !user_id || !rating) {
      setError('Post ID, User ID, and Rating are required.');
      return;
    }

    setLoading(true);
    try {
      const reviewData = { rating, comment, user_id };
      await createReview(postId, reviewData, token);

      setRating(0);
      setComment('');
      alert('Review added successfully!');
      setShowForm(false);
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add review.');
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const handleStarMouseEnter = (index) => {
    setHoveredRating(index + 1);
  };

  const handleStarMouseLeave = () => {
    setHoveredRating(null);
  };

  return (
    <div className="addreview-review-header">
      <h3>Đánh giá & bình luận</h3>
      <button onClick={() => setShowForm(true)} className="addreview-button">
        Đánh giá ngay
      </button>

      {showForm && (
        <div className="addreview-overlay">
          <div className="addreview-form-container">
            <h3>Thêm Đánh Giá</h3>
            <form onSubmit={handleSubmit}>
              <div className="addreview-form-group">
                <label>Đánh giá:</label>
                <div className="addreview-stars">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      onClick={() => handleStarClick(index)}
                      onMouseEnter={() => handleStarMouseEnter(index)}
                      onMouseLeave={handleStarMouseLeave}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={
                        index < (hoveredRating || rating)
                          ? '#FFD700'
                          : '#E4E5E9'
                      }
                      width="36px"
                      height="36px"
                      className="addreview-star"
                      style={{ cursor: 'pointer' }}
                    >
                      <path d="M12 .587l3.668 7.431 8.2 1.184-5.93 5.766 1.398 8.151L12 18.897l-7.336 3.872 1.398-8.151-5.93-5.766 8.2-1.184z" />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="addreview-form-group">
                <label htmlFor="comment">Bình luận:</label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Viết bình luận tại đây..."
                  className="addreview-textarea"
                ></textarea>
              </div>

              {error && <p style={{ color: 'red' }}>{error}</p>}

              <div className="addreview-buttons">
              <button
                type="submit"
                disabled={loading}
                className="addreview-submit-button"
              >
                {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="addreview-close-button"
              >
                Đóng
              </button>
            </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;