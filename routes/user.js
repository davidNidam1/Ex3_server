const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

// Route to create a new user
router.post('/', userController.createUser);

module.exports = router;
