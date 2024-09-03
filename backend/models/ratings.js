const mongoose = require('mongoose');

const ratingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  dishId: { type: mongoose.Schema.Types.ObjectId, ref: 'dishes', required: false }, 
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipes', required: false }, 
  rating: { type: Number, required: true, min: 1, max: 5 },
  averageRating: { type: Number, default: 0 }, 
    });

module.exports = mongoose.model('Ratings', ratingsSchema, 'ratings');
