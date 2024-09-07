const Post = require("../models/Post");
const User = require("../models/users");
const Chef = require("../models/chefs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Function to resolve mentions in a post description
async function resolveMentions(desc) {
  const userMentions = [];
  const chefMentions = [];

  // Regex to match mentions of both users and chefs (e.g., @username)
  const mentionRegex = /@(\w+)/g;
  let match;

  // Find all mentions
  while ((match = mentionRegex.exec(desc)) !== null) {
    const mention = match[1]; // Extract mention name

    // Search both the User and Chef collections
    const user = await User.findOne({ username: mention }).exec();
    const chef = await Chef.findOne({ username: mention }).exec();

    if (user) {
      userMentions.push({ userId: user._id }); // Add to user mentions with userId
    } else if (chef) {
      chefMentions.push({ chefId: chef._id }); // Add to chef mentions with chefId
    }
  }

  return { userMentions, chefMentions };
}

exports.getMentions = async (req, res) => {
  const { query } = req.params;

  try {
    // Fetch users with username and id
    const users = await User.find({ username: new RegExp(query, "i") })
      .limit(10)
      .select("username _id"); // Include _id in the selection

    // Fetch chefs with username and id
    const chefs = await Chef.find({ username: new RegExp(query, "i") })
      .limit(10)
      .select("username _id"); // Include _id in the selection

    res.status(200).json({
      success: true,
      users: users.map((user) => ({ id: user._id, username: user.username })),
      chefs: chefs.map((chef) => ({ id: chef._id, username: chef.username })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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

    // Resolve mentions
    const { userMentions, chefMentions } = await resolveMentions(desc);

    const newPost = new Post({
      userId: userId,
      img: req.files.img ? req.files.img[0].path : null,
      video: req.files.video ? req.files.video[0].path : null,
      desc: desc,
      userMentions, // Store user mentions
      chefMentions, // Store chef mentions
    });

    const savedPost = await newPost.save();

    res.status(201).json({
      success: true,
      post: savedPost,
      userMentions,
      chefMentions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all posts
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
      .populate({
        path: "replies.userId",
        select: "username",
      })
      .sort({ createdAt: -1 })
      .exec();

    const postsWithLikeStatus = posts.map((post) => {
      const isLiked = currentUserId && post.likedBy?.includes(currentUserId);
      return {
        ...post.toObject(),
        liked: isLiked || false,
      };
    });

    res.status(200).json({ success: true, posts: postsWithLikeStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Like or unlike a post
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

// Reply to a post
exports.replyToPost = async (req, res) => {
  const { postId } = req.params;
  const { userId, desc } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newReply = {
      userId,
      desc,
    };

    post.replies.push(newReply);

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get username by user ID
exports.getUsernameById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Search in both the Users and Chefs collections
    const user = await User.findById(userId).select("username");
    const chef = !user ? await Chef.findById(userId).select("username") : null;

    if (!user && !chef) {
      return res.status(404).json({ error: "User not found" });
    }

    const username = user ? user.username : chef.username;

    res.status(200).json({ username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function findPostsByChefMention(userId) {
  console.log("Finding posts by chef mention for user ID:", userId);

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID format");
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    const posts = await Post.find({
      "chefMentions.chefId": objectId,
    }).exec();

    console.log("Posts found:", posts);
    return posts;
  } catch (error) {
    console.error("Error finding posts by chef mention:", error);
    throw error;
  }
}

// Exported function to use in your routes
exports.findPostsByChefMention = async (req, res) => {
  console.log(
    "Handling findPostsByChefMention request with user ID:",
    req.params.userId
  );

  const { userId } = req.params;

  try {
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const posts = await findPostsByChefMention(userId);

    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Error handling findPostsByChefMention request:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sharePost = async (req, res) => {
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

    const { postId, desc } = req.body;

    const originalPost = await Post.findById(postId);

    if (!originalPost) {
      return res.status(404).json({ error: "Original post not found" });
    }

    const newPost = new Post({
      userId: userId,
      desc: desc || originalPost.desc,
      img: originalPost.img,
      video: originalPost.video,
      userMentions: originalPost.userMentions,
      chefMentions: originalPost.chefMentions,
      sharedFrom: originalPost._id,
    });

    const savedPost = await newPost.save();

    res.status(201).json({
      success: true,
      post: savedPost,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send a post to another user
exports.sendPostToUser = async (req, res) => {
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

    const { postId, recipientId } = req.body;

    // Check if the recipient is a valid user
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ error: "Recipient not found" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Add the recipient to the sentTo field
    post.sentTo.push(recipientId);
    const updatedPost = await post.save();

    res.status(200).json({
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a list of all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("username _id"); // Fetch users with username and ID

    res.status(200).json({
      success: true,
      users: users.map((user) => ({ id: user._id, username: user.username })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.postsSendToUser = async (req, res) => {
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

    // Find posts where the userId is in the sentTo field
    const posts = await Post.find({ sentTo: userId });

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
