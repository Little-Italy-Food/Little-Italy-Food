const jwt = require("jsonwebtoken");
const Recipe = require("../models/recipes");
const SavedRecipe = require("../models/savedRecipe");
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

exports.getAllRecipes = async (req, res) => {
  try {
    const {
      cookingTime,
      numberOfIngredients,
      dietaryRestrictions,
      mealType,
      cuisineType,
      mealPrepFriendly,
      freezableRecipe,
      sortBy,
      sortOrder,
      page = 1,
      search = "",
      difficulty,
    } = req.query;

    let query = { isDeleted: false };

    if (cookingTime) {
      const [minMinutes, maxMinutes] = cookingTime.split(",").map(Number);
      query["$expr"] = {
        $and: [
          {
            $gte: [
              {
                $add: [
                  { $multiply: ["$cookingTime.hours", 60] },
                  "$cookingTime.minutes",
                ],
              },
              minMinutes,
            ],
          },
          {
            $lte: [
              {
                $add: [
                  { $multiply: ["$cookingTime.hours", 60] },
                  "$cookingTime.minutes",
                ],
              },
              maxMinutes,
            ],
          },
        ],
      };
    }

    if (numberOfIngredients) {
      const numIngredients = Number(numberOfIngredients);
      query["$expr"] = {
        ...query["$expr"],
        $gte: [{ $size: "$ingredients" }, numIngredients],
      };
    }

    if (dietaryRestrictions) {
      const restrictions = dietaryRestrictions
        .split(",")
        .map((item) => item.trim());
      query.dietaryRestrictions = { $in: restrictions };
    }

    if (mealType) {
      query.mealType = new RegExp(`^${mealType.trim()}$`, "i");
    }

    if (cuisineType) {
      query.cuisineType = cuisineType;
    }

    if (mealPrepFriendly !== undefined) {
      query.mealPrepFriendly = mealPrepFriendly === "true";
    }

    if (freezableRecipe !== undefined) {
      query.freezableRecipe = freezableRecipe === "true";
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { name: searchRegex },
        { "ingredients.ingredientsName": searchRegex },
        { briefDescription: searchRegex },
        { comprehensiveDescription: searchRegex },
      ];
    }

    let sort = {};
    if (sortBy) {
      const order = sortOrder === "desc" ? -1 : 1;
      sort[sortBy] = order;
    }

    const recipes = await Recipe.find(query)
      .sort(sort)
      .skip((page - 1) * 6)
      .limit(6);

    if (recipes.length === 0) {
      return res.status(404).json({ message: "No recipes found." });
    }

    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching recipes." });
  }
};

exports.updateRecipe = async (req, res) => {
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

    const { recipeId } = req.params;

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

    const recipe = await Recipe.findOne({ _id: recipeId, chefId: userId });

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Update fields
    recipe.name = name || recipe.name;
    recipe.servings = servings || recipe.servings;
    recipe.ingredients = ingredients
      ? JSON.parse(ingredients)
      : recipe.ingredients;
    recipe.briefDescription = briefDescription || recipe.briefDescription;
    recipe.comprehensiveDescription =
      comprehensiveDescription || recipe.comprehensiveDescription;
    recipe.mainImage = req.files?.mainImage
      ? req.files.mainImage[0].path
      : recipe.mainImage;

    recipe.subImages = req.files?.subImages
      ? req.files.subImages.map((file) => file.path)
      : recipe.subImages;

    recipe.video = req.files?.video ? req.files.video[0].path : recipe.video;

    recipe.cookingTime = cookingTime
      ? JSON.parse(cookingTime)
      : recipe.cookingTime;
    recipe.cuisineType = cuisineType || recipe.cuisineType;
    recipe.mealType = mealType || recipe.mealType;
    recipe.nutritionValues = nutritionValues
      ? JSON.parse(nutritionValues)
      : recipe.nutritionValues;
    recipe.difficulty = difficulty || recipe.difficulty;
    recipe.mealPrepFriendly = mealPrepFriendly
      ? mealPrepFriendly === "true"
      : recipe.mealPrepFriendly;
    recipe.freezableRecipe = freezableRecipe
      ? freezableRecipe === "true"
      : recipe.freezableRecipe;
    recipe.dietaryRestrictions =
      dietaryRestrictions || recipe.dietaryRestrictions;

    await recipe.save();

    res.status(200).json({ message: "Recipe updated successfully", recipe });
  } catch (error) {
    console.error("Error updating recipe:", error); // Log full error
    res.status(500).json({
      error: `An error occurred while updating the recipe: ${error.message}`,
    });
  }
};

exports.deleteRecipe = async (req, res) => {
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

    const { recipeId } = req.params;

    if (!recipeId) {
      return res.status(400).json({ error: "Recipe ID is required" });
    }

    // Find the recipe by ID
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Check if the user is authorized to delete this recipe
    if (recipe.chefId.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this recipe" });
    }

    // Delete the recipe
    await Recipe.findByIdAndDelete(recipeId);

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error); // Log full error
    res.status(500).json({
      error: `An error occurred while deleting the recipe: ${error.message}`,
    });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const recipeObjectId = new mongoose.Types.ObjectId(recipeId);

    const recipe = await Recipe.findById(recipeObjectId);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    res.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the recipe." });
  }
};

exports.saveRecipe = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decodedToken.user.id;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "Invalid token or missing userId" });
    }
    const { recipeId, collectionName } = req.body;
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    let savedCollection = await SavedRecipe.findOne({ userId, collectionName });

    if (!savedCollection) {
      savedCollection = new SavedRecipe({
        userId,
        collectionName: collectionName || "General",
        recipes: [recipeId],
      });
    } else {
      if (!savedCollection.recipes.includes(recipeId)) {
        savedCollection.recipes.push(recipeId);
      } else {
        return res.status(400).json({
          message: "Recipe already saved in this collection",
        });
      }
    }

    await savedCollection.save();

    return res
      .status(200)
      .json({ message: "Recipe saved successfully", savedCollection });
  } catch (err) {
    console.error("Error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

exports.getUserCollections = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decodedToken.user.id;

    const collections = await SavedRecipe.find({ userId });

    if (!collections || collections.length === 0) {
      return res.status(404).json({ message: "No collections found" });
    }

    return res.status(200).json(collections);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getCollectionsByAuthenticatedUser = async (req, res) => {
  try {
    // Extract and verify the JWT token from the request headers
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.user.id;

    // Query the database to find all collections for the authenticated user
    const collections = await SavedRecipe.find({ userId });

    if (!collections || collections.length === 0) {
      return res
        .status(404)
        .json({ message: "No collections found for this user" });
    }

    return res.status(200).json(collections);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getRecipesByCuisine = async (req, res) => {
  const { cuisineType } = req.params; // Get cuisineType from params
  try {
    const recipes = await Recipe.find({ cuisineType, isDeleted: false }).exec();
    if (!recipes || recipes.length === 0) {
      return res
        .status(404)
        .json({ message: "No recipes found for this cuisine type" });
    }
    return res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message || "Unknown error",
    });
  }
};

exports.getRecipesByChefId = async (req, res) => {
  try {
    const { chefId } = req.params;

    if (!chefId) {
      return res.status(400).json({ error: "Chef ID is required" });
    }

    const chefObjectId = new mongoose.Types.ObjectId(chefId);

    const recipes = await Recipe.find({
      chefId: chefObjectId,
    });

    console.log("Number of recipes found for chefId:", recipes.length);

    if (recipes.length === 0) {
      return res
        .status(404)
        .json({ message: "No recipes found for this chef." });
    }

    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching recipes." });
  }
};

exports.getSavedRecipesByUserId = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.user.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const savedRecipes = await SavedRecipe.find({
      userId: userObjectId,
    }).populate("recipes");

    console.log(
      "Number of saved recipes found for userId:",
      savedRecipes.length
    );

    if (savedRecipes.length === 0) {
      return res
        .status(404)
        .json({ message: "No saved recipes found for this user." });
    }

    res.json(savedRecipes);
  } catch (error) {
    console.error("Error fetching saved recipes:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching saved recipes." });
  }
};
