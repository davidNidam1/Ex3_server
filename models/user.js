const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },
    
    profilePicture: String, // Path to profile picture (can be stored in server or external service)
    
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs representing friends
    
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs representing friend requests
    
    userId: { type: String, required: true, unique: true },
}, { id: false });

// Save a new user in 'users' collection:
const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
