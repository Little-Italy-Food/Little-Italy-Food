const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const upload = require("../middlewares/upload");

router.post(
  "/reviews",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  reviewController.createReview
);

router.put(
  "/reviews/:reviewId",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  reviewController.updateReview
);

router.get(
  "/reviews/average-rating/:recipeId",
  reviewController.getAverageRating
);

router.post("/reviews/:reviewId/reply", reviewController.postReply);

router.delete("/reviews/:reviewId", reviewController.deleteReview);

router.get("/reviews/recipe/:recipeId", reviewController.getReviewsByRecipeId);

module.exports = router;
