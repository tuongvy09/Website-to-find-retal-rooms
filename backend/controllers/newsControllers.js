
const News = require('../models/News');

// Lấy tất cả bài viết
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find();
    res.status(200).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Lấy một bài viết
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo bài viết mới
exports.createNews = async (req, res) => {
  const { title, description, content, author } = req.body; 
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Sử dụng URL ảnh từ Multer

  try {
    const newNews = new News({ title, description, content, author, imageUrl }); 
    await newNews.save();
    res.status(201).json(newNews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật bài viết
exports.updateNews = async (req, res) => {
  const { title, description, content, author} = req.body; 
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl; // Cập nhật URL nếu có tệp mới

  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { title, description, content, author, imageUrl },
      { new: true }
    );
    if (!news) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa bài viết
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    res.status(200).json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};