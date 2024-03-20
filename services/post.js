
const Post = require('../models/post');
const User = require('../models/user');
const tokenChecker  = require('../tokenChecker').tokenChecker;


const getFeedPosts = async (req) => {

    // Step 1: Extract current user's information from the token.
    // tokenChecker(req) also checks token validity.
    const currentUserName = tokenChecker(req); // returns the username, (not only checks).

    const currentUser = await User.findOne({ username: currentUserName });

    const { friends } = currentUser; // CurrentUser contains information about the current user, including his/her friends-list
    

    // Find posts from friends
    const friendPosts = await Post.find({ publisher: { $in: friends } }).sort({ date: -1 }).limit(20);

    // Find posts from non-friends
    const nonFriendPosts = await Post.find({ publisher: { $nin: friends } }).sort({ date: -1 }).limit(5);

    // Merge friend and non-friend posts
    const feedPosts = [...friendPosts, ...nonFriendPosts];

    // Sort the merged posts by date in descending order
    feedPosts.sort((a, b) => b.date - a.date);
    
    return feedPosts;
};


const createPost = async(req) => {
    if (tokenChecker(req)){
    // TODO: check next line:
    const post = new Post({text: req.body.text, publisher: req.body.publisher}); 
    if (req.body.date) { post.date = req.body.date; }
    if (req.body.picture) { post.picture = req.body.picture; }
    return await post.save();
    } else {
        // Token is invalid
        return { error: 'Invalid token' };
    }
};

const getPosts = async () => {
    return await Post.find({});
};

const getPostById = async (id) => {
    return await Post.findById(id);
};

//check if picture-edit needed
const updatePost = async (id, text) => {
    const post = await getPostById(id);
    if (!post) return null;
    post.text = text;
    await post.save();
    return post;
};

const deletePost = async (id) => {
    const post = await getPostById(id);
    if (!post) return null;
    await post.deleteOne();
    return post;
};

module.exports = { getFeedPosts, createPost, getPosts, getPostById, updatePost, deletePost }