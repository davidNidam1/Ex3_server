const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');


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

    

module.exports = router;
