const mongoose = require("mongoose");
const User = require("../models/user.model")
const PostModel = require("../models/post.model"); // Updated variable name
const handleError = (res, error, message = "⚠️ Oops! Something went wrong.") => {
    console.error("Error:", error); // Log the error details to the console
    res.status(422).json({ error: message, details: error });
};


// Controller functions
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await PostModel.find()
            .populate("createdBy", "_id name image")
            .populate("feedback.author", "_id name")
            .sort("-createdAt");

        console.log("Fetched posts:", posts); // Log fetched posts
        res.json(posts);
    } catch (error) {
        handleError(res, error, "😟 Failed to fetch posts.");
    }
};



exports.createPost = async (req, res) => {
    console.log("Incoming request body:", req.body); // Debugging line

    const { content, image } = req.body;
    if (!content || !image) {
        return res.status(422).json({ error: "🚧 Please provide all required fields!" });
    }

    try {
        const newPost = new PostModel({
            content,
            image,
            createdBy: req.user,
        });
        const savedPost = await newPost.save();
        res.json({ message: "🎉 Post created successfully!", post: savedPost });
    } catch (error) {
        handleError(res, error, "😟 Could not create the post.");
    }
};


exports.getMyPosts = async (req, res) => {
    try {
        const myPosts = await PostModel.find({ createdBy: req.user._id })
            .populate("createdBy", "_id name")
            .populate("feedback.author", "_id name")
            .sort("-createdAt");
        res.json(myPosts);
    } catch (error) {
        handleError(res, error, "😟 Could not fetch your posts.");
    }
};

exports.likePost = async (req, res) => {
    try {
        const updatedPost = await PostModel.findByIdAndUpdate(
            req.body.postId,
            { $push: { likedBy: req.user._id } },
            { new: true }
        ).populate("createdBy", "_id name image");
        res.json({ message: "❤️ Post liked!", post: updatedPost });
    } catch (error) {
        handleError(res, error, "😟 Unable to like the post.");
    }
};

exports.unlikePost = async (req, res) => {
    try {
        const updatedPost = await PostModel.findByIdAndUpdate(
            req.body.postId,
            { $pull: { likedBy: req.user._id } },
            { new: true }
        ).populate("createdBy", "_id name image");
        res.json({ message: "💔 Post unliked!", post: updatedPost });
    } catch (error) {
        handleError(res, error, "😟 Unable to unlike the post.");
    }
};

exports.commentOnPost = async (req, res) => {
    const newComment = {
        text: req.body.text,
        author: req.user._id,
    };
    try {
        const updatedPost = await PostModel.findByIdAndUpdate(
            req.body.postId,
            { $push: { feedback: newComment } },
            { new: true }
        )
            .populate("feedback.author", "_id name")
            .populate("createdBy", "_id name image");
        res.json({ message: "💬 Comment added!", post: updatedPost });
    } catch (error) {
        handleError(res, error, "😟 Unable to add comment.");
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await PostModel.findOne({ _id: req.params.postId }).populate("createdBy", "_id");
        if (!post || post.createdBy._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "🚫 You are not authorized to delete this post." });
        }
        await post.remove();
        res.json({ message: "🗑️ Post deleted successfully!" });
    } catch (error) {
        handleError(res, error, "😟 Unable to delete the post.");
    }
};

exports.getFollowingPosts = async (req, res) => {
    try {
        const posts = await PostModel.find({ createdBy: { $in: req.user.following } })
            .populate("createdBy", "_id name")
            .populate("feedback.author", "_id name");
        res.json(posts);
    } catch (error) {
        handleError(res, error, "😟 Could not fetch posts from followed users.");
    }
};



