const mongoose = require('mongoose');
const User = require('./user');
const Comment = require('./comment');

const Schema = mongoose.Schema;

const Post = new Schema({
  publisher: {
    type: String,
    ref: "User", // Name of the referenced model
    required: true,
  },
  date: {
    type: Date,
  },
  text: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
  profilePic: {
    type: String,
  },
  pid: {
    type: String,
    required: true,
    uniqe: true,
  },

  likes: [{ type: String, ref: "User" }],
  comments: [{ type: String, ref: "Comment" }],
});

module.exports = mongoose.model('Post', Post);