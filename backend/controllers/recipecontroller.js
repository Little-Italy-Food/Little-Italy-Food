const Recipe = require('../models/recipes');

exports.addRecipe = async (req, res) => {
  const { title, description, category, ingredients, instructions, cooktime, chefId } = req.body;
  const newRecipe = new Recipe({ title, description, category, ingredients, instructions, cooktime, chefId });
  await newRecipe.save();
  res.status(201).json(newRecipe);
};

exports.getRecipesByChef = async (req, res) => {
  const { chefId } = req.params;
  const recipes = await Recipe.find({ chefId, isDeleted: false });
  res.json(recipes);
};

exports.updateRecipe = async (req, res) => {
  const { recipeId } = req.params;
  const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, req.body, { new: true });
  res.json(updatedRecipe);
};

exports.deleteRecipe = async (req, res) => {
  const { recipeId } = req.params;
  await Recipe.findByIdAndUpdate(recipeId, { isDeleted: true });
  res.json({ msg: 'Recipe deleted successfully' });
};
