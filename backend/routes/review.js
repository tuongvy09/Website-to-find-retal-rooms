const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const middlewareControllers = require("../controllers/middlewareControllers");

// Thêm đánh giá bài đăng
router.post("/:postId", middlewareControllers.verifyToken, reviewController.createReview);

// Lấy danh sách đánh giá theo bài đăng
router.get("/:postId", reviewController.getReviewsByPost);

module.exports = router;