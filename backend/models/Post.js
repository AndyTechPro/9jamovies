const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  summary: String,
  content: String,
  cover: String,
  mp4file: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  views: {
    type: Number,
    default: 0, // Default value for views is 0
  },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
