const tokenService = require('../services/token');

// Controller function to handle user login and token generation
const processLogin = async (req, res) => {
  const { username, password } = req.body;
  // Authenticate user with username and password
  if (/* Authentication logic */) {
    // Generate token
    const token = tokenService.generateToken({ username });
    // Save token to database
    await tokenService.saveToken({ token });
    res.status(200).json({ token });
  } else {
    res.status(401).send('Invalid username or password');
  }
};

// Middleware function to verify token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = tokenService.verifyToken(token);
  if (decodedToken) {
    // Token is valid
    req.user = decodedToken;
    next();
  } else {
    res.status(401).send('Invalid token');
  }
};

module.exports = { processLogin, verifyToken };
