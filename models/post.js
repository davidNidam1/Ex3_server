const mongoose = require('mongoose');
const User = require('./user');

const Schema = mongoose.Schema;

const Post = new Schema({
    publisher: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Name of the referenced model
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    text: {
        type: String,
        required: true
    },
    picture: {
        type: String
    }
});

module.exports = mongoose.model('Post', Post);