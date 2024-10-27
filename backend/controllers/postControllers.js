const Post = require('../models/Post'); // Đảm bảo đường dẫn đúng

// Lấy tất cả bài đăng
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts); // Trả về mã trạng thái 200
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy bài đăng theo ID
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Bài đăng không tồn tại.' });
        }
        res.status(200).json(post); // Trả về mã trạng thái 200 khi thành công
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo bài đăng mới
exports.createPost = async (req, res) => {
    try {
        const post = new Post(req.body);
        const savedPost = await post.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cập nhật bài đăng
exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Bài đăng không tồn tại.' });
        }

        Object.assign(post, req.body); // Cập nhật các trường bài đăng
        const updatedPost = await post.save();
        res.status(200).json(updatedPost); // Trả về mã trạng thái 200 khi cập nhật thành công
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa bài đăng
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Bài đăng không tồn tại.' });
        }

        await post.remove();
        res.status(204).send(); // Trả về mã trạng thái 204 No Content khi xóa thành công
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
