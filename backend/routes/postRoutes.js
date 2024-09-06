// routes/postRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { createPost, getAllPosts } = require("../controllers/postController");

router.post(
  "/create",
  upload.fields([
    { name: "img", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createPost
);

router.get("/allposts", getAllPosts);

module.exports = router;
