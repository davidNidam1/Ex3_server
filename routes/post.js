const postController = require('../controllers/post');

const express = require('express');
var router = express.Router();

router.route('/')
    .get(postController.getPosts)
    .post(postController.createPost);

router.route('/:id')
    .get(postController.getPost)
    .delete(postController.deletePost)
    .patch(postController.updatePost) //update post

module.exports = router;