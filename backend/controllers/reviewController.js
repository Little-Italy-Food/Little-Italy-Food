const Review = require("../models/review");
const User = require("../models/users");
const Chef = require("../models/chefs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Create a new review/comment
exports.createReview = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;

    const chef = await Chef.findById(userId);
    if (chef) {
      return res
        .status(403)
        .json({ error: "Chefs are not allowed to post reviews." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { recipeId, content, rating } = req.body;

    const mainImage = req.files.mainImage ? req.files.mainImage[0].path : null;
    const video = req.files.video ? req.files.video[0].path : null;

    const newReview = new Review({
      recipeId,
      userId,
      content,
      image: mainImage,
      video,
      rating,
    });

    await newReview.save();

    res
      .status(201)
      .json({ message: "Review created successfully", review: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update review controller
exports.updateReview = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;

    const chef = await Chef.findById(userId);
    if (chef) {
      return res
        .status(403)
        .json({ error: "Chefs are not allowed to update reviews." });
    }

    const { reviewId } = req.params;
    const { content, rating } = req.body;
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this review" });
    }

    review.content = content || review.content;
    review.rating = rating || review.rating;

    if (req.files.mainImage) {
      review.image = req.files.mainImage[0].path;
    }
    if (req.files.video) {
      review.video = req.files.video[0].path;
    }

    await review.save();

    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete review controller
exports.deleteReview = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;

    const chef = await Chef.findById(userId);
    if (chef) {
      return res
        .status(403)
        .json({ error: "Chefs are not allowed to delete reviews." });
    }

    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this review" });
    }

    await Review.deleteOne({ _id: reviewId });

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all reviews by recipe ID
exports.getReviewsByRecipeId = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const reviews = await Review.find({ recipeId })
      .populate({
        path: "userId",
        select: "username",
      })
      .populate({
        path: "chefId",
        select: "username",
      })
      .populate({
        path: "replies.chefId",
        select: "username",
      });

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.postReply = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const chefId = decoded.user.id;

    const chef = await Chef.findById(chefId);
    if (!chef) {
      return res.status(403).json({ error: "Unauthorized, not a chef" });
    }

    const { reviewId } = req.params;
    const { content } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    review.replies.push({
      chefId,
      content,
    });

    await review.save();

    res.status(201).json({ message: "Reply added successfully", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAverageRating = async (req, res) => {
  try {
    const { recipeId } = req.params;

    // Ensure recipeId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({ message: "Invalid recipe ID" });
    }

    // Create an ObjectId instance
    const objectId = new mongoose.Types.ObjectId(recipeId);

    const result = await Review.aggregate([
      { $match: { recipeId: objectId } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ]);

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No ratings found for this recipe" });
    }

    res.status(200).json({ averageRating: result[0].averageRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
