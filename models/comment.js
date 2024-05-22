const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Comment = new Schema({
  userName: {
    type: String,
    ref: "User", // Name of the referenced model
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
  },
  cid: {
    type: String,
    required: true,
    uniqe: true,
  },
  postId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Comment", Comment);
