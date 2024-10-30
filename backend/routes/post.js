const postController = require("../controllers/postControllers");

const middlewareControllers = require("../controllers/middlewareControllers");

const router = require("express").Router();

// Lấy tất cả bài đăng
router.get("/posts", postController.getAllPosts);
// Lấy bài đăng theo ID
router.get("/posts/:id", postController.getPostById);
// Tạo bài đăng mới (cần xác thực)
router.post("/", middlewareControllers.verifyToken,postController.createPost);

router.put("/posts/:id", middlewareControllers.verifyToken, postController.updatePost);
// Xóa bài đăng (cần xác thực)
router.delete("/posts/:id", middlewareControllers.verifyTokenAndAdminAuth, postController.deletePost);
//Lấy bài đăng theo status
router.get('/posts-by-status', postController.getPostsByStatus);
module.exports = router;