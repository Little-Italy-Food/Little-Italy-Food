// backend/routes/reciperoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload"); // Import the upload middleware
const recipeController = require("../controllers/recipecontroller");

// Route to handle recipe creation with file uploads
router.post(
  "/recipes",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 4 },
    { name: "video", maxCount: 1 },
  ]),
  recipeController.createRecipe
);

// Other routes
router.get("/by-chef", recipeController.getRecipesByChef);
router.put("/:recipeId", recipeController.updateRecipe);
router.delete("/:recipeId", recipeController.deleteRecipe);
router.get("/recipes-get", recipeController.getAllRecipes);

module.exports = router;
