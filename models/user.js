const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const User = new Schema({
  username: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  profilePicture: {
    type: String, // Path to profile picture (can be stored in server or external service)
    required: true,
  },

  name: {
    type: String,
    required: true,
    unique: true,
  },

  friends: [{ type: String, ref: "User" }], // Array of user IDs representing friends

  friendRequests: [{ type: String, ref: "User" }], // Array of user IDs representing friend requests
});

// Pre-save hook to add the user as their own friend
User.pre('save', function(next) {
  if (!this.friends.includes(this.name)) {
    this.friends.push(this.name);
  }
  next();
});

module.exports = mongoose.model('User', User);