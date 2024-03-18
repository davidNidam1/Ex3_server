// services/user.js

const User = require('../models/user');

async function createUser(username, password) {
    try {
        // Check if user already exists with the given username  
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            throw new Error('Username already exists');
        }

        // Create a new user object
        const newUser = new User({
            username,
            password, 
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Return the saved user object
        return savedUser;
    } catch (error) {
        throw error;
    }
}

async function checkUserExistence(username) {
    try {
        // Check if user already exists with the given username  
        const existingUser = await User.findOne({ username });
        return existingUser;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createUser,
    checkUserExistence
};
