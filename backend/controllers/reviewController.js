const Review = require('../models/Review');
const Post = require('../models/Post');

// Tạo đánh giá mới
exports.createReview = async (req, res) => {
    const { rating, comment } = req.body;
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Bài đăng không tồn tại' });
        }

        const review = new Review({
            post_id: postId,
            user_id: req.user.id, 
            rating,
            comment,
        });

        await review.save();
        res.status(201).json({ review });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Lấy đánh giá theo bài đăng
exports.getReviewsByPost = async (req, res) => {
    const { postId } = req.params;

    try {
        const reviews = await Review.find({ post_id: postId }).populate('user_id', 'username');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Xóa đánh giá
exports.deleteReview = async (req, res) => {
    const { reviewId } = req.params;

    try {
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Đánh giá không tồn tại' });
        }

        // Kiểm tra quyền xóa
        if (review.user_id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Bạn không có quyền xóa đánh giá này' });
        }

        await review.deleteOne();
        res.status(200).json({ message: 'Đánh giá đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Chỉnh sửa đánh giá
exports.updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    try {
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Đánh giá không tồn tại' });
        }

        // Kiểm tra quyền chỉnh sửa
        if (review.user_id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa đánh giá này' });
        }

        // Cập nhật thông tin đánh giá
        if (rating) review.rating = rating;
        if (comment) review.comment = comment;

        await review.save();
        res.status(200).json({ message: 'Đánh giá đã được cập nhật', review });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};
