const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/token');

// Route for user login and token generation
router.post('/', tokenController.processLogin);



// Example protected route
// Only Example
// TODO: finish the related functions
router.get('/protected', tokenController.verifyToken, (req, res) => {
  res.status(200).send('Protected route accessed successfully');
});

module.exports = router;
