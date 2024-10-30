const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String, 
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  imageUrl: {
    type: String,
    required: false, 
  },
});

const News = mongoose.model('News', newsSchema);

module.exports = News;