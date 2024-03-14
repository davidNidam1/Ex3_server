const mongoose = require('mongoose');

// Define the schema for tokens
const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // expires in 1 hour
  }
});

// Create a model for tokens using the schema
const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
