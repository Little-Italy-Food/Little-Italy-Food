const express = require('express');
const router = express.Router();
const {
  addRecipe,
  getRecipesByChef,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipecontroller');

router.post('/', addRecipe);
router.get('/:chefId', getRecipesByChef);
router.put('/:recipeId', updateRecipe);
router.delete('/:recipeId', deleteRecipe);

module.exports = router;
