const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
  address: {
    exactaddress: {
      type: String, // Số nhà tên 
      required: true,
    },
    province: {
      type: String, // Tên tỉnh/thành phố
      required: true,
    },
    district: {
      type: String, // Tên quận/huyện
      required: true,
    },
    ward: {
      type: String, // Tên xã/phường
      required: true,
    },
  },
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  contactInfo: {
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true,
    },
    username: { 
      type: String,
      required: true,
    },
    phoneNumber: { 
      type: String,
      required: true,
    },
  },
  rentalPrice: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  rentalTarget: {
    type: String,
    required: true,
  },
  maxOccupants: {
    type: Number,
    required: true,
  },
  images: [{
    type: String, 
  }],
  youtubeLink: {
    type: String, // Đường dẫn tới video YouTube (nếu có)
  },
  status: {  // Trạng thái của bài viết
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending", // Mặc định là "pending"
  },
}, { timestamps: true });

const Post = mongoose.model('Post', postsSchema);

module.exports = Post;