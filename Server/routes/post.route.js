const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/user.Auth");
const postController = require("../controllers/post.controller");

// Routes
router.get("/allposts", userAuth, postController.getAllPosts);
router.post("/createPost", userAuth, postController.createPost);
router.get("/myposts", userAuth, postController.getMyPosts);
router.put("/like", userAuth, postController.likePost);
router.put("/unlike", userAuth, postController.unlikePost);
router.put("/comment", userAuth, postController.commentOnPost);
router.delete("/deletePost/:postId", userAuth, postController.deletePost);
router.get("/myfollowingpost", userAuth, postController.getFollowingPosts);

module.exports = router;