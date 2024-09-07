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
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = token ? jwt.verify(token, process.env.JWT_SECRET) : null;
    const currentUserId = decoded?.user.id;

    const posts = await Post.find()
      .populate({
        path: "userId",
        select: "username",
      })
      .sort({ createdAt: -1 })
      .exec();

    // Add a `liked` field to each post indicating whether the current user liked the post
    const postsWithLikeStatus = posts.map((post) => {
      // Safeguard against undefined likedBy
      const isLiked = currentUserId && post.likedBy?.includes(currentUserId);
      return {
        ...post.toObject(),
        liked: isLiked || false, // Default to false if not liked
      };
    });

    res.status(200).json({ success: true, posts: postsWithLikeStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.likePost = async (req, res) => {
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

    const { postId } = req.body;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user has already liked the post
    const isLiked = post.likedBy.includes(userId);

    if (isLiked) {
      // If the user has already liked the post, unlike it
      post.likedBy = post.likedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
      post.likes -= 1;
    } else {
      // If the user hasn't liked the post yet, like it
      post.likedBy.push(userId);
      post.likes += 1;
    }

    const updatedPost = await post.save();

    res.status(200).json({
      success: true,
      post: updatedPost,
      liked: !isLiked,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
