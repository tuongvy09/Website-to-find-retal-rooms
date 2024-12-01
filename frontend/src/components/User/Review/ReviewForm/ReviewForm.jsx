// ReviewForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addReview } from '../redux/actions/reviewActions';
import './ReviewForm.css';

const ReviewForm = ({ postId }) => {
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');
    const dispatch = useDispatch();

    const handleRatingChange = (event) => {
        setRating(event.target.value);
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (rating && comment) {
            const reviewData = {
                rating: parseInt(rating),
                comment,
            };
            // Dispatch action to send review data to backend
            dispatch(addReview(postId, reviewData));
        } else {
            alert('Vui lòng điền đầy đủ thông tin đánh giá.');
        }
    };

    return (
        <div className="review-form">
            <h3>Đánh giá bài viết</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="rating">Rating</label>
                    <select
                        id="rating"
                        value={rating}
                        onChange={handleRatingChange}
                    >
                        {[1, 2, 3, 4, 5].map((star) => (
                            <option key={star} value={star}>
                                {star} Star
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="comment">Nhận xét</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={handleCommentChange}
                        placeholder="Chia sẻ nhận xét của bạn..."
                    />
                </div>

                <button type="submit" className="btn-submit">
                    Gửi Đánh Giá
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
