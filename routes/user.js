const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const postController = require('../controllers/post');


// Route to create a new user
router.post('/', userController.createUser);

router.route('/:id')
    .get(userController.getUserDetails)
    .patch(userController.updateUser) 
    .delete(userController.deleteUser)

router.route('/:id/posts')
    .get(userController.getFriendPosts)
    .post(userController.createPost)

router.route('/:id/posts/:pid')
    .patch(postController.updatePost)
    .delete(postController.deletePost)

    
router.route('/:id/friends')
    .get(userController.getFriends)
    .post(userController.askToBeFriend)


router.route('/:id/friends/:fid')
    .patch(userController.acceptFriendship)
    .delete(userController.deleteFriend)

module.exports = router;
