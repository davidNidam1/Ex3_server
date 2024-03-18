// controllers/user.js

const userService = require('../services/user');

async function createUser(req, res) {
    try {
        // Extract user data from request body
        const { username, password } = req.body;

        // Call service function to create user
        const newUser = await userService.createUser(username, password);

        // Respond with the newly created user object
        res.status(201).json(newUser);
    } catch (error) {
        // Handle any errors that occur during user creation
        console.error('Error creating user:', error);
        //TODO: check if 500/404
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    createUser,
};
