const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/token');

// Route for user login and token generation
router.post('/', tokenController.processLogin);

module.exports = router;
