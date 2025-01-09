const Reel = require('../models/reels.model');

module.exports.createReel = async (req, res) => {
  try {
    const { caption } = req.body;
    const videoUrl = req.file.path;
    const userId = req.user._id;

    const reel = new Reel({ caption, videoUrl, user: userId });
    await reel.save();

    res.status(201).json({ message: '🎥 Reel created successfully!', reel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '⚠️ Could not create reel.' });
  }
};

module.exports.getReels = async (req, res) => {
  try {
    const reels = await Reel.find()
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({ reels });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '⚠️ Could not fetch reels.' });
  }
};

module.exports.likeReel = async (req, res) => {
  try {
    const { reelId } = req.body;
    const userId = req.user._id;

    const reel = await Reel.findByIdAndUpdate(
      reelId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    res.status(200).json({ message: '❤️ Reel liked!', reel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '⚠️ Could not like reel.' });
  }
};

module.exports.commentOnReel = async (req, res) => {
  try {
    const { reelId, comment } = req.body;
    const userId = req.user._id;

    const reel = await Reel.findByIdAndUpdate(
      reelId,
      { $push: { comments: { user: userId, comment } } },
      { new: true }
    );

    res.status(200).json({ message: '💬 Comment added!', reel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '⚠️ Could not comment on reel.' });
  }
};

exports.deleteReel = async (req, res) => {
  const { reelId } = req.params;  

  try {
    const reel = await Reel.findByIdAndDelete(reelId);

    if (!reel) {
      return res.status(404).json({ message: "Reel not found" });
    }

    res.status(200).json({ message: "Reel deleted successfully" });
  } catch (error) {
    console.error('Error deleting reel:', error);
    res.status(500).json({ message: 'Failed to delete reel' });
  }
};



module.exports.deleteComment = async (req, res) => {
  const { reelId, commentId } = req.params;
  const userId = req.user._id;

  try {
    const reel = await Reel.findById(reelId);

    if (!reel) return res.status(404).json({ message: "Reel not found" });

    const commentIndex = reel.comments.findIndex(
      (comment) => comment._id.toString() === commentId.toString()
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (reel.comments[commentIndex].user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    reel.comments.splice(commentIndex, 1);
    await reel.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Failed to delete comment" });
  }
};
