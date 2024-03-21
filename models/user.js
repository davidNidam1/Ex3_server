const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const User = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },
    
    profilePicture: {
        type: String, // Path to profile picture (can be stored in server or external service)
        required: true,
    },
    
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs representing friends
    
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs representing friend requests
    
    userId: { type: String, required: true, unique: true },
}, { id: false });


module.exports = mongoose.model('User', User);