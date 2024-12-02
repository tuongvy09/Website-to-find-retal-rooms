import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { createReview } from '../../../../redux/postAPI';
import { useSelector } from 'react-redux';
import './ReviewForm.css'; // Import CSS

const ReviewForm = () => {
    const { id } = useParams();
    const [postId, setPostId] = useState(id);
  
    const [rating, setRating] = useState(0); // Default value is 0 (not selected)
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
  
    // Get the current user from Redux state
    const currentUser = useSelector((state) => state.auth.login.currentUser);
    
    // Log currentUser to see its content
    console.log('Current User:', currentUser); // This will help you debug the currentUser object
  
    const token = currentUser?.accessToken;
    const user_id = currentUser?._id;  // Get user ID
  
    // Log user_id to check its value
    console.log('User ID:', user_id);  // This will help you debug if user_id is null or not
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Reset error state
      setError(null);
  
      if (!postId || !user_id || !rating) {
        setError('Post ID, User ID, and Rating are required.');
        return;
      }
  
      setLoading(true);
      try {
        // Send review data to backend
        const reviewData = { rating, comment, user_id }; // Include user_id in the review data
        await createReview(postId, reviewData, token);
  
        // Reset form and hide it after successful submission
        setRating(0);
        setComment('');
        alert('Review added successfully!');
        setShowForm(false); // Hide the form
        window.location.reload(); // Reload the page to reflect new data
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || 'Failed to add review.');
      } finally {
        setLoading(false);
      }
    };
  
    const handleStarClick = (index) => {
      setRating(index + 1); // Set rating (index starts from 0, so add 1)
    };

    
  return (
    <div className="addreview-review-header">
      <h3>Đánh giá & bình luận</h3>
      {/* Button to show form */}
      <button onClick={() => setShowForm(true)} className="addreview-button">
        Đánh giá ngay
      </button>

      {/* Form displayed in the middle of the screen */}
      {showForm && (
        <div className="addreview-overlay">
          <div className="addreview-form-container">
            <h3>Thêm Đánh Giá</h3>
            <form onSubmit={handleSubmit}>
              {/* Star Rating Input */}
              <div className="addreview-form-group">
                <label>Đánh giá:</label>
                <div className="addreview-stars">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      onClick={() => handleStarClick(index)}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={index < rating ? '#FFD700' : '#E4E5E9'}
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

              {/* Comment Input */}
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

              {/* Error Message */}
              {error && <p style={{ color: 'red' }}>{error}</p>}

              {/* Submit Button */}
              <button type="submit" disabled={loading} className="addreview-submit-button">
                {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
              </button>

              {/* Close Button */}
              <button type="button" onClick={() => setShowForm(false)} className="addreview-close-button">
                Đóng
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;