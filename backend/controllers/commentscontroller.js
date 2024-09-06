const Comment = require("../models/comments");

exports.getCommentsByDishId = async (req, res) => {
  try {
    const { dishId } = req.params;

    if (!dishId) {
      return res.status(400).json({ message: "Dish ID is required" });
    }

    const comments = await Comment.find({ dishId, isDeleted: false })
      .populate("userId", "username")
      .populate("replies.userId", "username")
      .sort({ createdAt: -1 });

    console.log(`Fetched ${comments.length} comments for dish ${dishId}`);
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ message: "Error fetching comments", error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { dishId, content } = req.body;

    if (!dishId || !content) {
      return res
        .status(400)
        .json({ message: "DishId and content are required" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const newComment = new Comment({
      userId: req.user.id,
      dishId,
      content,
    });

    console.log("Attempting to save comment:", newComment);
    await newComment.save();

    const populatedComment = await Comment.findById(newComment._id).populate(
      "userId",
      "username"
    );

    console.log("Comment saved successfully:", populatedComment);
    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Error in addComment:", error);
    res.status(500).json({
      message: "Error adding comment",
      error: error.message,
      stack: error.stack,
    });
  }
};

exports.addReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { replyContent } = req.body;

    if (!commentId || !replyContent) {
      return res
        .status(400)
        .json({ message: "Comment ID and reply content are required" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.replies.push({
      replyContent,
      userId: req.user.id,
    });

    await comment.save();

    const updatedComment = await Comment.findById(commentId)
      .populate("userId", "username")
      .populate("replies.userId", "username");

    res.status(201).json(updatedComment);
  } catch (error) {
    console.error("Error in addReply:", error);
    res
      .status(500)
      .json({ message: "Error adding reply", error: error.message });
  }
};
