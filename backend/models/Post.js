const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
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
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  rentalPrice: {
    type: Number,
    required: true,
  },
  area: {
    type: Number,
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
    type: String, // Đường dẫn tới hình ảnh
  }],
  videos: [{  // Mảng chứa đường dẫn tới video
    type: String, // Đường dẫn tới video
  }],
  youtubeLink: {
    type: String, // Đường dẫn tới video YouTube (nếu có)
  },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;