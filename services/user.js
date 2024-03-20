// services/user.js

const User = require('../models/user');
const Post = require('../models/post');


async function areFriends(username1, username2) {
    const user1 = await User.findOne({ username: username1 });
    const user2 = await User.findOne({ username: username2 });

    if (!user1 || !user2) {
        return false; // One of the users doesn't exist
    }

    // return true (friends) / false (not friends)
    return user1.friends.includes(username2) && user2.friends.includes(username1);
}


// TODO: check function again
async function getNewId() {
    try {
        // Fetch all users to get their IDs
        const users = await User.find({}, { userId: 1 });

        // If there are no users yet, assign the first ID as 1
        if (users.length === 0) {
            return 1;
        }

        // Find the maximum ID
        const maxId = Math.max(...users.map(user => parseInt(user.userId, 10)));

        // Assign a new ID by incrementing the maximum ID by 1
        return maxId + 1;
    } catch (error) {
        console.error('Error fetching users or calculating new ID:', error);
        throw new Error('Error generating new ID');
    }
}

async function createUser(username, password, profilePicture) {
    try {
        // Check if user already exists with the given username  
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            throw new Error('Username already exists');
        }

        // Create a new user object
        // pic the largest id and add 1
        // TODO: check syntax
        const newUser = new User({
            username,
            password, 
            profilePicture,
            friends: [],
            friendRequests: [],
            friendRequests: getNewId()
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

async function getUserDetails(username) {
    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        console.error('Error fetching user details from database:', error);
        throw new Error('Error fetching user details');
    }
}


async function updateUser(username, { profilePicture }) {
    try {
        // Find the user by username
        const user = await User.findOne({ username });

        // If user is not found, return null
        if (!user) {
            return null;
        }

        // Update the profile picture
        user.profilePicture = profilePicture;

        // Save the updated user object
        await user.save();

        // Return the updated user object
        return user;
    } catch (error) {
        // Handle any errors that occur during user update
        console.error('Error updating user:', error);
        throw new Error('Error updating user');
    }
}


async function deleteUser(username) {
    try {
        // Find the user by username
        const user = await User.findOne({ username });

        // If user is not found, return null
        if (!user) {
            return null;
        }

        // Delete the user
        await user.deleteOne();

        //TODO: check if returned message is needed.
        // Return a success message or null (user not found)
        return { message: 'User deleted successfully' };
    } catch (error) {
        // Handle any errors that occur during user deletion
        console.error('Error deleting user:', error);
        throw new Error('Error deleting user');
    }
}


async function getFriendPosts(currentUserUsername, friendUsername) {
    try {
        // Find the friend user
        const friend = await User.findOne({ username: friendUsername });

        // If friend not found, return an empty array
        if (!friend) {
            return [];
        }

        // Check if currentUser is in friend's friend list
        if (!friend.friends.includes(currentUserUsername)) {
            return []; // currentUser is not a friend of friendUsername
        }

        // Get friend's posts sorted by date
        const friendPosts = await Post.find({ publisher: friendUsername }).sort({ date: -1 });

        return friendPosts;
    } catch (error) {
        // Handle any errors that occur during fetching friend posts
        console.error('Error fetching friend posts:', error);
        throw new Error('Error fetching friend posts');
    }
}


async function createPost(username, { text, picture }) {
    try {
        // Create the new post
        const newPost = new Post({
            publisher: username,
            text: text,
            picture: picture,
            date: new Date() // Set the current date as the default date TODO - check
        });

        // Save the new post to the database
        await newPost.save();

        return newPost;
    } catch (error) {
        // Handle any errors that occur during post creation
        console.error('Error creating post:', error);
        throw new Error('Error creating post');
    }
}


async function getFriends(username) {
    try {
        // Find the user by username and select the friends field
        const user = await User.findOne({ username }).select('friends');

        // If user is not found or user has no friends, return an empty array
        if (!user || !user.friends) {
            return [];
        }

        // Return the friends list
        return user.friends;
    } catch (error) {
        // Handle any errors that occur during friend retrieval
        console.error('Error getting friends:', error);
        throw new Error('Error getting friends');
    }
}


async function askToBeFriend(currentUser, requestedUser) {
    try {
        // Find the requested user and update its friendRequests list
        await User.updateOne({ username: requestedUser }, { $addToSet: { friendRequests: currentUser } });
    } catch (error) {
        // Handle any errors that occur during friend request sending
        console.error('Error sending friend request:', error);
        throw new Error('Error sending friend request');
    }
}



async function acceptFriendship(senderUser, receiverUser) {
    try {
        // Update the sender's friend list
        await User.updateOne({ username: senderUser }, { $addToSet: { friends: receiverUser } });

        // Update the receiver's friendRequests list
        await User.updateOne({ username: receiverUser }, { $pull: { friendRequests: senderUser } });
    } catch (error) {
        // Handle any errors that occur during friendship acceptance
        console.error('Error accepting friendship:', error);
        throw new Error('Error accepting friendship');
    }
}


const User = require('../models/user');

async function deleteFriend(currentUser, friendToRemove) {
    try {
        // Update the current user's friend list to remove the friend to remove
        await User.updateOne({ username: currentUser }, { $pull: { friends: friendToRemove } });
    } catch (error) {
        // Handle any errors that occur during friend removal
        console.error('Error removing friend:', error);
        throw new Error('Error removing friend');
    }
}

module.exports = {
    createUser,
    checkUserExistence,
    getNewId,
    getUserDetails,
    updateUser,
    deleteUser,
    areFriends,
    getFriendPosts,
    createPost,
    getFriends,
    askToBeFriend,
    acceptFriendship,
    deleteFriend,
};
