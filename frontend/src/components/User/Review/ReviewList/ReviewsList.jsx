import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { getReviewsByPostId } from '../../../../redux/postAPI';
import { setReviews } from '../../../../redux/reviewSlice';
import './ReviewsList.css';

const ReviewsList = ({ postId }) => {
  const dispatch = useDispatch();
  const { reviews = [], loading, error } = useSelector((state) => state.reviews);
  const [currentPage, setCurrentPage] = useState(0);
  const [reviewsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' (mới tới cũ), 'asc' (cũ tới mới)

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
    setCurrentPage(0); // Reset về trang đầu tiên khi thay đổi sắp xếp
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

  return (
    <div>
      {/* Nút lọc */}
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
    </div>
  );
};

export default ReviewsList;