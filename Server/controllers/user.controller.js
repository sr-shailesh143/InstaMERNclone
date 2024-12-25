const mongoose = require("mongoose");
const Post = require("../models/post.model");
const User = require("../models/user.model");

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "🛑 User not found. Please check the user ID!" });
        }

        const posts = await Post.find({ postedBy: req.params.id }).populate("postedBy", "_id");

        res.status(200).json({ user, posts });
    } catch (err) {
        console.error("Error in getUserProfile:", err.message);
        res.status(500).json({ error: "❌ Internal server error. Please try again later." });
    }
};


// Follow user
exports.followUser = (req, res) => {
    User.findByIdAndUpdate(
        req.body.followId,
        { $push: { followers: req.user._id } },
        { new: true },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: "⚠️ Failed to follow the user. Please try again." });
            }
            User.findByIdAndUpdate(
                req.user._id,
                { $push: { following: req.body.followId } },
                { new: true }
            )
                .then((result) => res.json({ message: "✅ Successfully followed the user!", user: result }))
                .catch((err) => {
                    return res.status(422).json({ error: "⚠️ Failed to update your following list. Please try again." });
                });
        }
    );
};

// Unfollow user
exports.unfollowUser = (req, res) => {
    User.findByIdAndUpdate(
        req.body.followId,
        { $pull: { followers: req.user._id } },
        { new: true },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: "⚠️ Failed to unfollow the user. Please try again." });
            }
            User.findByIdAndUpdate(
                req.user._id,
                { $pull: { following: req.body.followId } },
                { new: true }
            )
                .then((result) => res.json({ message: "✅ Successfully unfollowed the user!", user: result }))
                .catch((err) => {
                    return res.status(422).json({ error: "⚠️ Failed to update your following list. Please try again." });
                });
        }
    );
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
  
