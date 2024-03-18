const mongoose = require('mongoose');
const User = require('./user');

const Schema = mongoose.Schema;
const Post = new Schema({
    publisher: {
        ref: User,
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
        type: String //affirm
    }


});
module.exports = mongoose.model('Post', Post);