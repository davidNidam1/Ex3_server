const token = require('jsonwebtoken');
const Token = require('../models/token');

// Secret key for token
const secretKey = 'aVerySecretKey'; 

// Function to generate token
const createToken = async (name) => {
  const createdToken = token.sign(name, secretKey); //TODO check if assigning a variable possible syntaxly
  return createdToken;
};

// Function to verify token
// Supposed to return the username.
// TODO: checl it acctually does.
const verifyToken = (jwt) => {
  try {
    const name = token.verify(jwt, secretKey);
    return name;
  } catch (error) {
    return null;
  }
};

// Function to save token to database
const saveToken = async (tokenData) => {
  const token = new Token(tokenData);
  return await token.save();
};

module.exports = { createToken, verifyToken, saveToken };
