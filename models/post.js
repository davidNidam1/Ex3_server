const mongoose = require('mongoose') ;

const Schema = mongoose.Schema;
const Post = new Schema({
//    "id" : {
//    type: int,     //capital i?
//    required: true //defaultive?
//    },
    date : {
        type: Date,
        default: Date.now
    },
    text : {
        type: String,
        required: true
    },
    picture : {
        type: String //affirm
    }


});
module.exports = mongoose.model('Post', Post);