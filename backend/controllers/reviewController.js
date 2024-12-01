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
            user_id: req.user.id, // Lấy từ middlewareControllers.verifyToken
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