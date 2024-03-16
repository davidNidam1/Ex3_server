// services/user.js

const User = require('../models/user');

async function createUser(username, email, password) {
    try {
        // Check if user already exists with the given username or email
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            throw new Error('Username or email already exists');
        }

        // Create a new user object
        const newUser = new User({
            username,
            email,
            password, // Note: In a production environment, password should be hashed
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Return the saved user object
        return savedUser;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createUser,
};
