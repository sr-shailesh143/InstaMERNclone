const express = require('express');
const userAuth = require("../middlewares/user.Auth");
const { createReel, getReels, likeReel, commentOnReel, deleteReel, deleteComment } = require('../controllers/reels.controller');
const multer = require('multer');

const upload = multer({ dest: 'uploads/videos/' }); 
const router = express.Router();

router.post('/create', userAuth, upload.single('video'), createReel);
router.get('/all', userAuth, getReels);
router.post('/like', userAuth, likeReel);
router.post('/comment', userAuth, commentOnReel);

  
  router.delete('/delete/:reelId', userAuth, deleteReel);
router.delete('/comment/:reelId/:commentId', userAuth, deleteComment);


module.exports = router;
