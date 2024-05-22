// services/user.js

const User = require('../models/user');
const Post = require('../models/post');
const e = require('cors');


async function areFriends(name1, name2) {
    const user1 = await User.findOne({ name: name1 });
    const user2 = await User.findOne({ name: name2 });

    if (!user1 || !user2) {
        return false; // One of the users doesn't exist
    }

    // return true (friends) / false (not friends)
    return user1.friends.includes(name2) && user2.friends.includes(name1);
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

async function createUser(username, password, profilePicture, name) {
    try {
        // Check if user already exists with the given username  
        const existingUser = await User.findOne({ name });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // // Generate new user ID
        // const userId = await getNewId();

        // Create a new user object
        // pick the largest id and add 1
        // TODO: check syntax
        const newUser = new User({
            username,
            password, 
            profilePicture,
            name,
            friends: [],
            friendRequests: [],
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Return the saved user object
        return savedUser;
    } catch (error) {
        throw error;
    }
}

async function checkUserExistence(name) {
    try {
        // Check if user already exists with the given username  
        const existingUser = await User.findOne({ name });
        return existingUser;
    } catch (error) {
        throw error;
    }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.code = 404; // HTTP status code for "Not Found"
  }
}

async function getUserDetails(name) {
  try {
    // Find user by username
    const user = await User.findOne({ name });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  } catch (error) {
    console.error("Error fetching user details from database:", error);
    throw error;
}
}


async function updateUser(name, { profilePicture }) {
    try {
        // Find the user by username
        const user = await User.findOne({ name });

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


async function deleteUser(name) {
    try {
        // Find the user by username
        const user = await User.findOne({ name });

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


async function getFriendPosts(currentUsername, friendname) {
    try {
        // Find the friend user
        const friend = await User.findOne({ name: friendname });

        // If friend not found, return an empty array
        if (!friend) {
            return [];
        }

        // Check if currentUser is in friend's friend list
        if (!friend.friends.includes(currentUsername)) {
            return []; // currentUser is not a friend of friendUsername
        }

        // Get friend's posts sorted by date
        const friendPosts = await Post.find({ publisher: friendname }).sort({ date: -1 });

        return friendPosts;
    } catch (error) {
        // Handle any errors that occur during fetching friend posts
        console.error('Error fetching friend posts:', error);
        throw new Error('Error fetching friend posts');
    }
}


async function createPost(name, { text, picture, profilePic }) {
    try {

        // Fetch the user document based on the username
        const user = await User.findOne({ name: name });

        // Ensure that the user exists
        if (!user) {
            throw new NotFoundError(`User with username '${name}' not found`);
        }
        // Create the new post
        const newPost = new Post({
          publisher: name, // Set the publisher to the ObjectId of the user,
          text: text,
          picture: picture,
          profilePic: profilePic,
          date: new Date(), // Set the current date as the default date TODO - check
        });

        newPost.pid = newPost._id.toString()

        // Save the new post to the database
        await newPost.save();

        return newPost;
    } catch (error) {
        // Handle any errors that occur during post creation
        console.error('Error creating post:', error);
        throw error;
    }
}


async function getFriends(name) {
    try {
        // Find the user by username and select the friends field
        const user = await User.findOne({ name }).select('friends');

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
        await User.updateOne({ name: requestedUser }, { $addToSet: { friendRequests: currentUser } });
        console.log("added to list successfully");
    } catch (error) {
        // Handle any errors that occur during friend request sending
        console.error('Error sending friend request:', error);
        throw new Error('Error sending friend request');
    }
}



async function acceptFriendship(senderUser, receiverUser) {
    try {
        // Find the user document corresponding to the receiverUser
        const receiver = await User.findOne({ name: receiverUser });
        const sender = await User.findOne({ name: senderUser });

        if (!receiver) {
            throw new Error('Receiver user not found');
        }

        // Update the sender's friend list
        await User.updateOne({ name: senderUser }, { $addToSet: { friends: receiver.name } });

        // Update the receiver's friends list
        await User.updateOne({ name: receiverUser }, { $addToSet: { friends: sender.name } });
        // Update the receiver's friendRequests list
        await User.updateOne({ name: receiverUser }, { $pull: { friendRequests: sender.name } });
    } catch (error) {
        // Handle any errors that occur during friendship acceptance
        console.error('Error accepting friendship:', error);
        throw new Error('Error accepting friendship');
    }
}


async function deleteFriend(currentUser, friendToRemove) {
    try {
        console.log("removing");
        // Update the current user's friend list to remove the friend to remove
        await User.updateOne( { name: currentUser }, { $pull: { friendRequests: friendToRemove } });
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
