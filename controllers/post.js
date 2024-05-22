const postService = require('../services/post');
const tokenChecker = require('../tokenChecker').tokenChecker;


const getFeedPosts = async (req, res) => {
    try {
        const posts = await postService.getFeedPosts(req);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPostsComments = async (req, res) => {
        try {
            // Extract post ID from request parameters
            const postId = req.params.pid;

            // Retrieve the post by ID
            const post = await postService.getPostById(postId);

            // Check if the post exists
            if (!post) {
                return res.status(404).json({ errors: ['Post not found'] });
            }

            // Update the post
            const comments = await postService.getPostsComments(postId);

            // Respond with the updated post
            res.status(200).json(comments);
        } catch (error) {
            console.error('Error getting comments:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
};

const addComment = async (req, res) => {
       try {
         // Extract post data from request body
         const { content, pic, postId, userName } = req.body;

         // Create the post
         const newComment = await postService.addComment({
           content,
           pic,
           postId,
           userName,
         });

         // Respond with the newly created post object
         res.status(201).json(newComment);
       } catch (error) {
         // Handle any errors that occur during post creation
         console.error("Error creating comment:", error);
         res.status(error.code).json({ message: error.message });
       }
};

const deleteComment = async (req, res) => {
    try {
        // Extract name from request parameters
        const name = req.params.id;

        // Extract post ID from request parameters
        const postId = req.params.pid;

        // Extract comment ID from request parameters
        const commentId = req.params.cid;
        console.log("in");

        // Extract user from token
        const currentUser = await tokenChecker(req);

        // Check if the current user is the publisher of the comment
        if (currentUser !== name) {
        return res.status(403).json({
            errors: ["Unauthorized: You are not the publisher of this comment"],
        });
        }

        // Delete the post
        console.log("goin to delete");
        const deletedComment = await postService.deleteComment({ commentId, postId });

        // Respond with the deleted post
        console.log("comment deleted successfully!");
        res.status(200).json(deletedComment);
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(error.code).json({ message: error.message });
    }
};

const updateComment = async (req, res) => {
     try {
        console.log("starting");
       // Extract post ID from request parameters
       const postId = req.params.pid;
       const commentId = req.body.cid;

       // Extract user from token
       const currentUser = await tokenChecker(req);

       // Retrieve the post by ID
       const comment = await postService.getCommentById(commentId);

       // Check if the post exists
       if (!comment) {
         return res.status(404).json({ errors: ["comment not found"] });
       }

       // Check if the current user is the publisher of the post
       if (comment.userName !== currentUser) {
         return res
           .status(403)
           .json({
             errors: ["Unauthorized: You are not the publisher of this comment"],
           });
       }

       // Extract text and picture from request body
       const { content } = req.body;

       // Update the post
       const updatedComment = await postService.updateComment(commentId, {
         content,
       });

       // Respond with the updaupdated comment
       res.status(200).json(updatedComment);
     } catch (error) {
       console.error("Error updating post:", error);
       res.status(500).json({ message: "Internal Server Error" });
     }
};



// const getUserDetails = async (req, res) => {
// };

const createPost = async (req, res) => {
    res.json(await postService.createPost(req)); //check syntax
};

const getPosts = async (_, res) => {
    res.json(await postService.getPosts());
};

const getPost = async (req, res) => {
    const post = await postService.getPostById(req.params.id);
    if (!post) {
        return res.status(404).json({ errors: ['Post not found'] });
    }
    res.json(post);
};

//handle exception
const updatePost = async (req, res) => {
    try {
        // Extract post ID from request parameters
        const postId = req.params.pid;

        // Extract user from token
        const currentUser = await tokenChecker(req);

        // Retrieve the post by ID
        const post = await postService.getPostById(postId);

        // Check if the post exists
        if (!post) {
            return res.status(404).json({ errors: ['Post not found'] });
        }

        // Check if the current user is the publisher of the post
        if (post.publisher !== currentUser) {
            return res.status(403).json({ errors: ['Unauthorized: You are not the publisher of this post'] });
        }

        // Extract text and picture from request body
        const {text} = req.body;

        // Update the post
        const updatedPost = await postService.updatePost(postId, {text});

        // Respond with the updated post
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateLikes = async (req, res) => {
  try {
    // Extract post ID from request parameters
    const postId = req.params.pid;

    // Retrieve the post by ID
    const post = await postService.getPostById(postId);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ errors: ["Post not found"] });
    }

    // Extract text and picture from request body
    const { likes } = req.body;

    // Update the post
    const updatedPost = await postService.updateLikes(postId, { likes });

    // Respond with the updated post
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deletePost = async (req, res) => {
    try {
        // Extract name from request parameters
        const name = req.params.id;

        // Extract post ID from request parameters
        const postId = req.params.pid;

        // Extract user from token
        const currentUser =  await tokenChecker(req);

        // Check if the current user is the publisher of the post
        if (currentUser !== name) {
            return res.status(403).json({ errors: ['Unauthorized: You are not the publisher of this post'] });
        }

        // Delete the post
        const deletedPost = await postService.deletePost(postId);

        // Respond with the deleted post
        console.log("post deleted successfully!");
        res.status(200).json(deletedPost);
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(error.code).json({ message: error.message });
    }
};


module.exports = {
  getFeedPosts,
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  getPostsComments,
  addComment,
  deleteComment,
  updateComment,
  updateLikes,
};