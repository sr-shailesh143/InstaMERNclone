const Reel = require('../models/reels.model');

module.exports.createReel = async (req, res) => {
  try {
    const { caption } = req.body;
    const videoUrl = req.file.path; // Assuming multer is used for video uploads
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
