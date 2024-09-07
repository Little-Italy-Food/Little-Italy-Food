// routes/postRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const {
  createPost,
  getAllPosts,
  likePost,
  replyToPost,
  getUsernameById,
  getMentions,
  findPostsByChefMention,
  sharePost,
  sendPostToUser,
  getAllUsers,
  postsSendToUser,
} = require("../controllers/postController");

router.post(
  "/create",
  upload.fields([
    { name: "img", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createPost
);

router.get("/allposts", getAllPosts);
router.post("/like", likePost);
router.post("/posts/:postId/reply", replyToPost);
router.get("/user/:userId", getUsernameById);
router.get("/mentions/:query", getMentions);
router.get("/chef-mention/:userId", findPostsByChefMention);
router.post("/share", sharePost);
router.post("/sendPostToUser", sendPostToUser);
router.get("/users", getAllUsers);
router.get("/sentToMe", postsSendToUser);

module.exports = router;
