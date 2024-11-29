const Post = require('../models/Post');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');

exports.createPost = async (req, res) => {
    try {
        const { title, content, address, category, rentalPrice, area, rentalTarget, maxOccupants, youtubeLink, contactInfo } = req.body;

        const imageUrls = [];
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                imageUrls.push(file.path); 
            });
        }

        const newPost = new Post({
            title,
            content,
            address: JSON.parse(address),  
            category,
            rentalPrice,
            area,
            rentalTarget,
            maxOccupants,
            youtubeLink,
            contactInfo: JSON.parse(contactInfo),
            images: imageUrls,  
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost); 
    } catch (error) {
        console.error("Error creating post:", error);  
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10; 
        const startIndex = (page - 1) * limit;
        const total = await Post.countDocuments();
        const posts = await Post.find()
            .skip(startIndex)
            .limit(limit);
        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            posts,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        console.log("Request ID:", req.params.id);
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Bài đăng không tồn tại.' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết bài đăng:', error);
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật bài đăng
exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Bài đăng không tồn tại.' });
        }

        Object.assign(post, req.body); 
        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Bài đăng không tồn tại.' });
        }
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Delete post successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getPostsByStatus = async (req, res) => {
    try {
        const { status } = req.query;
        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const posts = await Post.find({ status });
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts by status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//Lấy bài đăng(new)
exports.getUserPostsByStateAndVisibility = async (req, res) => {
    try {
        const { status, visibility } = req.query; 

        if (!status || !visibility) {
            return res.status(400).json({ message: "State and visibility are required" });
        }

        const posts = await Post.find({
            "contactInfo.user": req.user.id,
            status,
            visibility
        });

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching user posts by state and visibility:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//Cập nhật bài đăng
exports.updatePost = async (req, res) => { 
    const { postId } = req.params;
    let updateData = req.body;
    
    updateData.status = "update";
    updateData.visibility = "hidden";
  
    try {
      const updatedPost = await Post.findByIdAndUpdate(postId, updateData, { new: true });
      if (!updatedPost) {
        return res.status(404).json({ message: 'Bài đăng không tồn tại' });
      }
      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  };  

exports.toggleVisibility = async (req, res) => {
    const { postId } = req.params;
  
    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Bài đăng không tồn tại' });
      }
      post.visibility = post.visibility === 'visible' ? 'hiden' : 'visible';
      await post.save();
  
      res.json({ message: 'Trạng thái hiển thị đã được cập nhật', visibility: post.visibility });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  };

  const convertPrice = (price) => {
    const value = parseFloat(price.replace(/[^\d.-]/g, ''));
    return isNaN(value) ? 0 : value; // Trả về 0 nếu không chuyển được
  };
  
  const convertArea = (area) => {
    const value = parseFloat(area.replace(/[^\d.-]/g, ''));
    return isNaN(value) ? 0 : value; // Trả về 0 nếu không chuyển được
  };  
  
  //tìm kiếm bài đăng
  exports.searchPosts = async (req, res) => {
    try {
      const { keyword, province, category, minPrice, maxPrice, minArea, maxArea } = req.query;
  
      // Tạo filter từ query
      const filter = {
        visibility: 'visible',
        status: 'approved',
      };
  
      // Tìm theo từ khóa
      if (keyword) {
        filter.$or = [
          { category: { $regex: keyword, $options: 'i' } },
          { title: { $regex: keyword, $options: 'i' } },
          { content: { $regex: keyword, $options: 'i' } },
        ];
      }
  
      // Tìm theo tỉnh thành
      if (province) filter["address.province"] = province;
  
      // Tìm theo danh mục
      if (category) filter.category = category;
  
      // Tìm theo giá
      if (minPrice || maxPrice) {
        filter["contactInfo.rentalPrice"] = {};
        if (minPrice) filter["contactInfo.rentalPrice"].$gte = convertPrice(minPrice);
        if (maxPrice) filter["contactInfo.rentalPrice"].$lte = convertPrice(maxPrice);
      }
  
      // Tìm theo diện tích
      if (minArea || maxArea) {
        filter.area = {};
        if (minArea) filter.area.$gte = convertArea(minArea);
        if (maxArea) filter.area.$lte = convertArea(maxArea);
      }
  
      // Lấy bài đăng từ MongoDB
      const posts = await Post.find(filter);
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };  

//Lấy post của admin theo trạng thái có phân trang
exports.getUserPostAd = async (req, res) => {
    try {
        const { status, visibility, page = 1, limit = 10 } = req.query;

        if (!status || !visibility) {
            return res.status(400).json({ message: "State and visibility are required" });
        }
        const startIndex = (page - 1) * limit; 
        const total = await Post.countDocuments({
            "contactInfo.user": req.user.id,
            status,
            visibility,
        });

        const posts = await Post.find({
            "contactInfo.user": req.user.id,
            status,
            visibility,
        })
        .skip(startIndex)
        .limit(parseInt(limit))
        .exec();

        res.status(200).json({
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            posts,
        });
    } catch (error) {
        console.error("Error fetching user posts by state and visibility:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};