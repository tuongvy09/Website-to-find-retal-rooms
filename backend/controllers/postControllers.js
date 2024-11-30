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

  function convertPrice(priceString) {
    if (!priceString) return 0;
    // Loại bỏ chữ cái và ký tự không phải số
    const cleanString = priceString.replace(/[^\d.]/g, "");
    return parseFloat(cleanString);
  }   

// Chuyển đổi diện tích từ chuỗi sang số (m²)
const convertArea = (area) => {
  if (!area) return 0;
  const match = area.match(/([\d.]+)\s*m²/);
  console.log("Convert Area Input:", area, "Output:", match ? parseFloat(match[1]) : 0);
  return match ? parseFloat(match[1]) : 0;
};

  //tìm kiếm bài đăng
  exports.searchPosts = async (req, res) => {
    try {
      const { keyword, province, category, minPrice, maxPrice, minArea, maxArea } = req.query;
      console.log("minPrice từ request:", minPrice);
      
      const filter = {
        visibility: "visible",
        status: "aprroved",
      };
  
      if (province) filter["address.province"] = province;
  
      if (keyword) {
        filter.$or = [
          { category: { $regex: keyword, $options: "i" } },
          { title: { $regex: keyword, $options: "i" } },
          { content: { $regex: keyword, $options: "i" } },
        ];
      }
  
      if (category) filter.category = category;
  
      if (minPrice || maxPrice) {
        filter["contactInfo.rentalPrice"] = {};
        if (minPrice) filter["contactInfo.rentalPrice"].$gte = convertPrice(minPrice);
        if (maxPrice) filter["contactInfo.rentalPrice"].$lte = convertPrice(maxPrice);
      }
  
      if (minArea || maxArea) {
        filter.area = {};
        if (minArea) filter.area.$gte = convertArea(minArea);
        if (maxArea) filter.area.$lte = convertArea(maxArea);
      }
  
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

// Thống kê số lượng bài đăng theo ngày
exports.getPostCountByDateRange = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
  
      if (!startDate || !endDate) {
        return res.status(400).json({ error: "startDate and endDate are required" });
      }
  
      const postsByDate = await Post.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
            visibility: "visible",
            status: "aprroved",
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
  
      res.status(200).json(postsByDate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };  

// Thống kê 7 loại hình cho thuê có nhiều bài đăng nhất
exports.getTopCategories = async (req, res) => {
    try {
      const topCategories = await Post.aggregate([
        {
          $match: {
            visibility: "visible",
            status: "aprroved",
          },
        },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 7 },
      ]);
  
      res.status(200).json(topCategories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
// Thống kê 7 tỉnh/thành phố có nhiều bài đăng nhất
exports.getTopProvinces = async (req, res) => {
    try {
      const topProvinces = await Post.aggregate([
        {
          $match: {
            visibility: "visible",
            status: "aprroved",
          },
        },
        {
          $group: {
            _id: "$address.province",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 7 },
      ]);
  
      res.status(200).json(topProvinces);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };  