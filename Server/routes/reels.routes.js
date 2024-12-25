const express = require('express');
const userAuth = require("../middlewares/user.Auth");
const { createReel, getReels, likeReel, commentOnReel } = require('../controllers/reels.controller');
const multer = require('multer');

const upload = multer({ dest: 'uploads/videos/' }); // Temporary storage; configure properly in production
const router = express.Router();

router.post('/create', userAuth, upload.single('video'), createReel);
router.get('/all', userAuth, getReels);
router.post('/like', userAuth, likeReel);
router.post('/comment', userAuth, commentOnReel);
// In your backend routes (e.g., `reels.controller.js`)
router.post("/api/reels/like/:reelId", userAuth, async (req, res) => {
    const { reelId } = req.params;
    const userId = req.user._id;
  
    try {
      const reel = await reelModel.findById(reelId);
  
      if (!reel) return res.status(404).json({ message: "Reel not found" });
  
      const alreadyLiked = reel.likes.includes(userId);
  
      if (alreadyLiked) {
        // Unlike the reel
        reel.likes = reel.likes.filter((id) => id.toString() !== userId.toString());
      } else {
        // Like the reel
        reel.likes.push(userId);
      }
  
      await reel.save();
      res.status(200).json({ message: alreadyLiked ? "Reel unliked" : "Reel liked" });
    } catch (err) {
      res.status(500).json({ message: "Failed to like/unlike reel" });
    }
  });

  router.post("/api/reels/comment/:reelId", userAuth, async (req, res) => {
    const { reelId } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;
  
    try {
      const reel = await reelModel.findById(reelId);
  
      if (!reel) return res.status(404).json({ message: "Reel not found" });
  
      const newComment = { user: userId, text: comment };
  
      reel.comments.push(newComment);
      await reel.save();
  
      res.status(200).json({ message: "Comment added successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to post comment" });
    }
  });
  

module.exports = router;
