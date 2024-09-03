const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  type: String,
  quantity: Number,
  unit: String,
  alternative: String,
  ingredientsName: String,
});

const nutritionSchema = new mongoose.Schema({
  protein: Number,
  fat: Number,
  carbs: Number,
  calories: Number,
  vitamins: String,
});

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  servings: { type: Number, required: true },
  ingredients: [ingredientSchema],
  briefDescription: String,
  comprehensiveDescription: String,
  mainImage: String,
  subImages: [String],
  video: String,
  cookingTime: {
    hours: Number,
    minutes: Number,
  },
  cuisineType: String,
  mealType: String,
  nutritionValues: nutritionSchema,
  difficulty: String,
  mealPrepFriendly: Boolean,
  freezableRecipe: Boolean,
  dietaryRestrictions: String,
  chefId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chefs",
    required: true,
  },
  rating: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
  approved: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);
