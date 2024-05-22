
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require("../models/comment");
const tokenChecker  = require('../tokenChecker').tokenChecker;


const getFeedPosts = async (req) => {

    // Step 1: Extract current user's information from the token.
    // tokenChecker(req) also checks token validity.
    const currentName = await tokenChecker(req); // returns the name, (not only checks).

    const currentUser = await User.findOne({ name: currentName });

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

 const getPostsComments = async (postId) => {
    try {
      const comments = await Comment.find({ postId: postId });
      const postsComments = [...comments];

      return postsComments;
    } catch (error) {
      // Handle any errors that occur 
      console.error("Error getting comments from schema:", error);
      throw new Error("Error getting comments");
    }
 };

 const addComment = async ({content, pic, postId, userName}) => {
   try {
     // Create the new comment
     const newComment = new Comment({
       userName: userName,
       content: content,
       pic: pic,
       postId: postId,
     });

     newComment.cid = newComment._id.toString();

     await Post.updateOne(
       { postId: postId },
       { $addToSet: { comments: newComment.cid } }
     );

     // Save the new post to the database
     await newComment.save();
     return newComment;

   } catch (error) {
     // Handle any errors that occur during post creation
     console.error("Error creating comment:", error);
     throw error;
   }
 };

 const deleteComment = async ({commentId, postId}) => {
    try {
    console.log("deleting...")
    // Find the post by its ID and delete it
    await Post.updateOne({ pid: postId }, { $pull: { commentId } });
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      throw new NotFoundError("comment not found");
    }
    console.log("deleted!");
    return deletedComment;
    } catch (error) {
    // Handle any errors that occur during post deletion
    console.error("Error deleting comment:", error);
    throw error;
    }
 };

 const updateComment = async (commentId, {content}) => {
    try {
      const comment = await getCommentById(commentId);
      if (!comment) return null;

      // Update the relevant members if provided
      if (content !== undefined) {
        comment.content = content;
      }

      await comment.save();
      return comment;
    } catch (error) {
        // Handle any errors that occur during post update
        console.error('Error updating comment:', error);
        throw new Error('Error updating comment');
    }
};

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.code = 404; // HTTP status code for "Not Found"
  }
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

const getPostById = async (postId) => {
    return await Post.findById(postId);
};

const getCommentById = async (commentId) => {
  return await Comment.findById(commentId);
};

async function updatePost(postId, {text}) {
    try {
      const post = await getPostById(postId);
      if (!post) return null;

      // Update the relevant members if provided
      if (text !== undefined) {
        post.text = text;
      }

      await post.save();
      return post;
    } catch (error) {
        // Handle any errors that occur during post update
        console.error('Error updating post:', error);
        throw new Error('Error updating post');
    }
};

async function updateLikes(postId, {likes}) {
    try {
      const post = await getPostById(postId);
      if (!post) return null;

      // Update the relevant members if provided
      if (likes !== undefined) {
        post.likes = likes;
      }

      await post.save();
      return post;
    } catch (error) {
        // Handle any errors that occur during post update
        console.error('Error updating post:', error);
        throw new Error('Error updating post');
    }
};

async function deletePost(postId) {
    try {
      // Find the post by its ID and delete it
      const comments = await Comment.find({ postId: postId });

      // Iterate through the comments and delete each one
      for (const comment of comments) {
        await Comment.findByIdAndDelete(comment.cid);
      }
      const deletedPost = await Post.findByIdAndDelete(postId);

      if (!deletePost) {
        throw new NotFoundError("post not found");
      }
      return deletedPost;
    } catch (error) {
        // Handle any errors that occur during post deletion
        console.error('Error deleting post:', error);
        throw error;
    }
}

module.exports = {
  getFeedPosts,
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsComments,
  addComment,
  deleteComment,
  getCommentById,
  updateComment,
  updateLikes,
};