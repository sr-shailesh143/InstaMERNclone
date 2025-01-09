const mongoose = require("mongoose");
const Post = require("../models/post.model");
const User = require("../models/user.model");

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId).select("-password"); 
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const posts = await Post.find({ createdBy: userId })
        .populate("createdBy", "_id name photo")
        .sort("-createdAt"); 
  
      res.json({ user, posts });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Failed to fetch user profile." });
    }
  };



// Follow User
exports.followUser = async (req, res) => {
  try {
    const { followId } = req.body; 
    const userId = req.user._id;  

    
    if (!followId || !userId) {
      return res.status(400).json({ error: "Invalid input." });
    }

    const followedUser = await User.findByIdAndUpdate(
      followId,
      { $addToSet: { followers: userId } }, 
      { new: true }
    );

    if (!followedUser) {
      return res.status(404).json({ error: "User to follow not found." });
    }

    const currentUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { following: followId } }, 
      { new: true }
    );

    const populatedCurrentUser = await User.findById(userId).populate("following");
    const populatedFollowedUser = await User.findById(followId).populate("followers");

    res.status(200).json({
      message: "Followed user successfully!",
      currentUser: populatedCurrentUser,
      followedUser: populatedFollowedUser,
    });
  } catch (error) {
    console.error("Error in followUser:", error);
    res.status(500).json({ error: "Failed to follow the user." });
  }
};





// Unfollow User
exports.unfollowUser = async (req, res) => {
  try {
    const { followId } = req.body;
    const userId = req.user._id;

    const unfollowedUser = await User.findByIdAndUpdate(
      followId,
      { $pull: { followers: userId } }, 
      { new: true }
    );

    if (!unfollowedUser) {
      return res.status(404).json({ error: "User to unfollow not found." });
    }

    await User.findByIdAndUpdate(
      userId,
      { $pull: { following: followId } },
      { new: true }
    );

    const currentUser = await User.findById(userId).populate("following");

    res.status(200).json({ message: "Unfollowed successfully", currentUser });
  } catch (error) {
    console.error("Error in unfollowUser:", error);
    res.status(500).json({ error: "Failed to unfollow the user." });
  }
};



// Upload profile picture
exports.uploadProfilePic = async (req, res) => {
    try {
      const result = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { photo: req.body.pic } },
        { new: true }
      );
  
      if (!result) {
        return res.status(404).json({ error: "❌ User not found!" });
      }
  
      res.json({ message: "🖼️ Profile picture updated successfully!", user: result });
    } catch (err) {
      console.error(err);
      return res.status(422).json({ error: "❌ Unable to update profile picture. Please try again later." });
    }
  };
  
