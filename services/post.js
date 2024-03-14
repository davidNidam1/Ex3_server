//const { text } = require('express');
const Post = require('../models/post');

const createPost = async(date, text, picture) => {
    const post = new Post({text: text}); 
    if (date) post.date = date;
    if (picture) post.picture = picture;
    return await post.save();
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

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost }