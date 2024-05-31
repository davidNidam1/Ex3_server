// controllers/user.js
const tokenChecker  = require('../tokenChecker').tokenChecker;
const userService = require('../services/user');
const { checkForCorruptedUrls } = require("../urlsChecker"); // Import the checker function

async function createUser(req, res) {
    try {
        // Extract user data from request body
        const { username, name, password, profilePicture } = req.body;

        // Print the req.body to the console
        console.log('Request Body:', req.body);

        // Call service function to create user
        const newUser = await userService.createUser(
          username,
          password,
          profilePicture,
          name
        );
        // Respond with the newly created user object
        res.status(200).json(newUser);
    } catch (error) {
        // Handle any errors that occur during user creation
        console.error('Error creating user:', error);
        //TODO: check if 500/404
        res.status(409).json({ message: 'Internal Server Error' });
    }
}
async function getUserDetails(req, res) {
    try {
        //TODO: check if need to use username instead of nickName:
        const name = req.params.id; // Retrieve username from req.params.id
        const userDetails = await userService.getUserDetails(name);
      
        return res.status(200).json(userDetails);
    } catch (error) {
        console.error('Error getting user details:', error);
        return res.status(error.code).json({message : error.message });
    }
}

// Right now the function changes profilePicture only.
async function updateUser(req, res) {
    try {
        
        const name = req.params.id; // Retrieve username from req.params.id
        const { profilePicture } = req.body; // Extract profilePicture from request body

        // Check if the user's token is valid
        if (!tokenChecker(req)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Update user's profile picture
        const updatedUser = await userService.updateUser(name, { profilePicture });

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
        const name = req.params.id; // Retrieve username from req.params.id

        // Check if the user's token is valid
        if (!tokenChecker(req)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Delete user
        const deletedUser = await userService.deleteUser(name);

        // If user is not found, respond with 404
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

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
        const friendname = req.params.id; // Retrieve friend's name from req.params.id

        // Check if the user's token is valid
        if (!tokenChecker(req)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Get the current user's username
        const currentUsername = await tokenChecker(req);

        // Check if the current user and the friend are friends
        const areFriends = await userService.areFriends(currentUsername, friendname);

        // If they are friends, retrieve friend's posts
        if (areFriends) {
            const friendPosts = await userService.getFriendPosts(currentUsername, friendname);

            // Respond with the friend's posts
            res.status(200).json(friendPosts);
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
      // Extract user's name from req.params.id
      const name = req.params.id;

      // Check if the user's token is valid
      if (!tokenChecker(req)) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Extract post data from request body
      const { text, picture, profilePic } = req.body;

      // Check if the URL is blacklisted
      const isBlacklisted = await checkForCorruptedUrls(text);

      // If URL is blacklisted, return an error response
      if (isBlacklisted) {
        console.log("URL is blacklisted and cannot be posted");
        return res.status(403).json({ message: "URL is blacklisted and cannot be posted" });
      }

      // Create the post
      const newPost = await userService.createPost(name, {
        text,
        picture,
        profilePic,
      });

      // Respond with the newly created post object
      res.status(201).json(newPost);
    } catch (error) {
        // Handle any errors that occur during post creation
        console.error('Error creating post:', error);
        res.status(error.code).json({ message: error.message });
    }
}

async function getFriends(req, res) {
    try {
        // Extract the username from request parameters
        const name = req.params.id;

        // Extract the current user from the token
        const currentUser = await tokenChecker(req);

        // Check if the current user is the same as the requested user or is a friend
        if (currentUser !== name && !(await userService.areFriends(currentUser, name))) {
            return res.status(403).json({ errors: ['Unauthorized: You are not authorized to view this user\'s friends'] });
        }

        // Retrieve the user's friends list
        const friends = await userService.getFriends(name);

        // Respond with the friends list
        res.json({ friends });
    } catch (error) {
        console.error('Error getting friends:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


async function askToBeFriend(req, res) {
    try {
        // Extract the username from request parameters
        const requestedUser = await req.params.id;

        // Extract the current user from the token
        const currentUser = await tokenChecker(req);

        // Call the service function to send friend request
        await userService.askToBeFriend(currentUser, requestedUser);

        console.log("Friend request sent successfully");
        res.status(200).json({ message: 'Friend request sent successfully' });
    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


async function acceptFriendship(req, res) {
    try {
        // Extract the usernames from request parameters
        const currentUser = await tokenChecker(req);
        const senderUser = req.params.fid;
        const receiverUser = req.params.id;

        // Check if the current user is the same as the receiver
        if (currentUser === receiverUser) {
            // Call the service function to accept friendship
            await userService.acceptFriendship(senderUser, receiverUser);
            console.log("Friendship accepted successfully");
            res.status(200).json(currentUser);
        } else {
            res.status(403).json({ errors: ['Unauthorized: You are not allowed to accept this friendship request'] });
        }
    } catch (error) {
        console.error('Error accepting friendship:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


async function deleteFriend(req, res) {
    try {
        // Extract the usernames from request parameters
        const currentUser = await tokenChecker(req);
        const friendToRemove = req.params.fid;
        const userToDeleteFrom = req.params.id;

        // Check if the current user is the same as the user to delete from
        if (currentUser === userToDeleteFrom) {
            // Call the service function to delete friendship
            await userService.deleteFriend(currentUser, friendToRemove);
            console.log("Friend removed successfully");
            res.status(200).json(currentUser);
        } else {
            res.status(403).json({ errors: ['Unauthorized: You are not allowed to remove this friendship'] });
        }
    } catch (error) {
        console.error('Error removing friend:', error);
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
    getFriends,
    askToBeFriend,
    acceptFriendship,
    deleteFriend,
};
