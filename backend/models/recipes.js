const mongoose = require('mongoose');

const recipesSchema = new mongoose.Schema({
  chefId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chefs', required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  ingredients: { type: String, required: true },
  instructions: { type: String, required: true },
  cooktime: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Recipes', recipesSchema, 'recipes'); 