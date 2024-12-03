import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { getReviewsByPostId } from '../../../../redux/postAPI';
import { setReviews, deleteReview, updateReview } from '../../../../redux/reviewSlice';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { editReview, deleteReview as deleteReviewAPI  } from '../../../../redux/postAPI';
import './ReviewsList.css';

const ReviewsList = ({ postId, userId }) => {
  const dispatch = useDispatch();
  const { reviews = [], loading, error } = useSelector((state) => state.reviews);
  const [currentPage, setCurrentPage] = useState(0);
  const [reviewsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState('desc');
  const [showForm, setShowForm] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const currentUser = useSelector((state) => state.auth.login.currentUser); 
  const id = currentUser?._id;
  const accessToken = currentUser?.accessToken;

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
        <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
    setCurrentPage(0);
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const offset = currentPage * reviewsPerPage;
  const currentReviews = sortedReviews.slice(offset, offset + reviewsPerPage);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message || 'Không thể tải đánh giá.'}</p>;



  const handleEdit = (review) => {
    setShowForm(true);
    setEditReviewId(review._id);  
    setRating(review.rating);
    setComment(review.comment);
  };

  const handleSubmit = async (reviewId) => {
    // e.preventDefault();

    if (!accessToken) {
      console.error('Access token is missing or invalid');
      return;
    }

    const updatedData = { rating, comment };
    try {
      await editReview(reviewId, updatedData, accessToken);
      dispatch(updateReview(reviewId));
      setShowForm(false);
      window.location.reload(); 
    } catch (error) {
      console.error('Lỗi khi chỉnh sửa đánh giá:', error);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteReviewAPI(reviewId, accessToken);
      dispatch(deleteReview(reviewId)); 
    } catch (error) {
      console.error('Lỗi khi xóa đánh giá:', error);
    }
  };  

return (
    <div>
      <div className="filter-buttons">
        <button
          className={sortOrder === 'desc' ? 'active' : ''}
          onClick={() => handleSortOrderChange('desc')}
        >
          Mới tới cũ
        </button>
        <button
          className={sortOrder === 'asc' ? 'active' : ''}
          onClick={() => handleSortOrderChange('asc')}
        >
          Cũ tới mới
        </button>
      </div>

      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <>
          {currentReviews.map((review) => (
            <div key={review._id} className="review-item">
              <p><strong>{review.user_id?.username}</strong></p>
              <p>{new Date(review.createdAt).toLocaleString()}</p>
              <p>Comment: {review.comment}</p>
              <div className="stars">{renderStars(review.rating)}</div>

              {review.user_id._id === id && (
                <div className="review-actions">
                  <FaEdit onClick={() => handleEdit(review)} />
                  <FaTrash onClick={() => handleDelete(review._id)} />
                </div>
              )}
            </div>
          ))}

          <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={'...'}
            pageCount={Math.ceil(reviews.length / reviewsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
        </>
      )}

      {showForm && (
        <div className="addreview-overlay">
          <div className="addreview-form-container">
            <h3>Chỉnh sửa Đánh Giá</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(editReviewId); 
            }}>
              <div className="addreview-form-group">
                <label>Đánh giá:</label>
                <div className="addreview-stars">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      onClick={() => setRating(index + 1)}
                      onMouseEnter={() => setRating(index + 1)}
                      onMouseLeave={() => setRating(rating)}
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
                  {loading ? 'Đang gửi...' : 'Cập nhật đánh giá'}
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

export default ReviewsList;