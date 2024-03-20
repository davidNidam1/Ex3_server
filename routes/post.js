const postController = require('../controllers/post');

const express = require('express');
var router = express.Router();

router.route('/')
    .get(postController.getFeedPosts)

//router.route('/:id')
    //.get(postController.getPost)
    //.delete(postController.deletePost)
    //.patch(postController.updatePost) //update post

    //router.route('/')
// TODO: change paths to right onces
    //.get(postController.getPosts)
    //.post(postController.createPost);

module.exports = router;