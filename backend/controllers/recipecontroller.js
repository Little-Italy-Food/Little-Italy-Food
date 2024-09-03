const jwt = require("jsonwebtoken"); // Make sure jwt is required at the top of your file
const Recipe = require("../models/recipes"); // Ensure Recipe model is imported
const mongoose = require("mongoose");

// Create a new recipe
exports.createRecipe = async (req, res) => {
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

    const {
      name,
      servings,
      ingredients,
      briefDescription,
      comprehensiveDescription,
      cookingTime,
      cuisineType,
      mealType,
      nutritionValues,
      difficulty,
      mealPrepFriendly,
      freezableRecipe,
      dietaryRestrictions,
    } = req.body;

    const recipe = new Recipe({
      name,
      servings,
      ingredients: JSON.parse(ingredients),
      briefDescription,
      comprehensiveDescription,
      mainImage: req.files.mainImage ? req.files.mainImage[0].path : null,
      subImages: req.files.subImages
        ? req.files.subImages.map((file) => file.path)
        : [],
      video: req.files.video ? req.files.video[0].path : null,
      cookingTime: JSON.parse(cookingTime),
      cuisineType,
      mealType,
      nutritionValues: JSON.parse(nutritionValues),
      difficulty,
      mealPrepFriendly: mealPrepFriendly === "true",
      freezableRecipe: freezableRecipe === "true",
      dietaryRestrictions,
      chefId: userId,
    });

    await recipe.save();
    res.status(201).json({ message: "Recipe created successfully", recipe });
  } catch (error) {
    console.error("Error creating recipe:", error); // Log full error
    res.status(500).json({
      error: `An error occurred while creating the recipe: ${error.message}`,
    });
  }
};

exports.getRecipesByChef = async (req, res) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract userId from the decoded token
    const chefId = decoded.user.id;

    // Log the chefId for debugging
    console.log("Decoded Chef ID:", chefId);

    // Convert chefId to ObjectId
    const chefObjectId = new mongoose.Types.ObjectId(chefId);

    // Log the ObjectId type for debugging
    console.log("Converted Chef ObjectId:", chefObjectId);

    // Fetch recipes based on the chefId
    const recipes = await Recipe.find({
      chefId: chefObjectId,
    });

    // Log the number of recipes found
    console.log("Number of recipes found:", recipes.length);

    if (recipes.length === 0) {
      return res
        .status(404)
        .json({ message: "No recipes found for this chef." });
    }

    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "An error occurred while fetching recipes." });
  }
};

exports.updateRecipe = async (req, res) => {
  const { recipeId } = req.params;
  const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, req.body, {
    new: true,
  });
  res.json(updatedRecipe);
};

exports.deleteRecipe = async (req, res) => {
  const { recipeId } = req.params;
  await Recipe.findByIdAndUpdate(recipeId, { isDeleted: true });
  res.json({ msg: "Recipe deleted successfully" });
};
