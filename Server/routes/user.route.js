const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/user.Auth");
const userController = require("../controllers/user.controller");

router.get("/user/:id", userController.getUserProfile);

// Follow user
router.put("/follow", userAuth, userController.followUser);

router.put("/unfollow", userAuth, userController.unfollowUser);

router.put("/uploadProfilePic", userAuth, userController.uploadProfilePic);

module.exports = router;