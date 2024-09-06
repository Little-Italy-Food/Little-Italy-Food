// controllers/postController.js
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");

exports.createPost = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.user.id;

    if (!userId) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const { desc } = req.body;

    const newPost = new Post({
      userId: userId,
      img: req.files.img ? req.files.img[0].path : null,
      video: req.files.video ? req.files.video[0].path : null,
      desc: desc,
    });

    const savedPost = await newPost.save();
    res.status(201).json({ success: true, post: savedPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    // Populate the userId field with the corresponding user document
    const posts = await Post.find()
      .populate({
        path: "userId",
        select: "username", // Only select the username field
      })
      .exec(); // Ensure the query is executed

    res.status(200).json({ success: true, posts: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
