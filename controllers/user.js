// controllers/user.js
const tokenChecker  = require('../tokenChecker').tokenChecker;
const userService = require('../services/user');
const postController = require('../controllers/post');


async function createUser(req, res) {
    try {
        // Extract user data from request body
        const { firstName, lastName, email, password, nickName, gender, month, day, year, profilePicture } = req.body;
        // Call service function to create user
        const newUser = await userService.createUser({username: nickName, password, profilePicture});
        // WE check the user's token validity 
        if (tokenChecker(req)){
        // Respond with the newly created user object
        res.status(201).json(newUser);
        }
    } catch (error) {
        // Handle any errors that occur during user creation
        console.error('Error creating user:', error);
        //TODO: check if 500/404
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getUserDetails(req, res) {
    try {
        //TODO: check if need to use username instead of nickName:
        const username = req.params.id; // Retrieve username from req.params.id
        const userDetails = await userService.getUserDetails(username);
        if (!userDetails) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(userDetails);
    } catch (error) {
        console.error('Error getting user details:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Right now the function changes profilePicture only.
async function updateUser(req, res) {
    try {
        
        const username = req.params.id; // Retrieve username from req.params.id
        const { profilePicture } = req.body; // Extract profilePicture from request body

        // Check if the user's token is valid
        if (!tokenChecker(req)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Update user's profile picture
        const updatedUser = await userService.updateUser(username, { profilePicture });

        // Respond with the updated user object
        res.json(updatedUser);
    } catch (error) {
        // Handle any errors that occur during user profile picture update
        console.error('Error updating user profile picture:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


async function deleteUser(req, res) {
    try {
        const username = req.params.id; // Retrieve username from req.params.id

        // Check if the user's token is valid
        if (!tokenChecker(req)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Delete user
        const deletedUser = await userService.deleteUser(username);

        // If user is not found, respond with 404
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        //TODO: check if returned res is needed.
        // Respond with a success message
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        // Handle any errors that occur during user deletion
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


async function getFriendPosts(req, res) {
    try {
        const friendUsername = req.params.id; // Retrieve friend's username from req.params.id

        // Check if the user's token is valid
        if (!tokenChecker(req)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Get the current user's username
        const currentUserUsername = tokenChecker(req);

        // Check if the current user and the friend are friends
        const areFriends = await userService.areFriends(currentUserUsername, friendUsername);

        // If they are friends, retrieve friend's posts
        if (areFriends) {
            const friendPosts = await userService.getFriendPosts(currentUserUsername, friendUsername);

            // Respond with the friend's posts
            res.json(friendPosts);
        } else {
            res.status(403).json({ message: 'Forbidden: Not friends with the requested user' });
        }
    } catch (error) {
        // Handle any errors that occur during fetching friend posts
        console.error('Error fetching friend posts:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


async function createPost(req, res) {
    try {
        // Extract user's username from req.params.id
        const username = req.params.id;

        // Check if the user's token is valid
        if (!tokenChecker(req)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Extract post data from request body
        const { text, picture } = req.body;

        // Create the post
        const newPost = await userService.createPost(username, { text, picture });

        // Respond with the newly created post object
        res.status(201).json(newPost);
    } catch (error) {
        // Handle any errors that occur during post creation
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    createUser,
    getUserDetails,
    updateUser,
    deleteUser,
    getFriendPosts, 
    createPost,
};
