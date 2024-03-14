const jwt = require('jsonwebtoken');
const Token = require('../models/token');

// Secret key for JWT token
const secretKey = 'your_secret_key_here'; // Change this to a more secure key

// Function to generate JWT token
const generateToken = (data) => {
  return jwt.sign(data, secretKey);
};

// Function to verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
};

// Function to save token to database
const saveToken = async (tokenData) => {
  const token = new Token(tokenData);
  return await token.save();
};

module.exports = { generateToken, verifyToken, saveToken };
