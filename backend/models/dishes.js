const mongoose = require('mongoose');

const dishesSchema = new mongoose.Schema({
  chefId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chefs', required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  ingredients: { type: String, required: true },
  price: { type: String, required: true },
  imageUrl: { type: String }, // Added image URL field
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Dishes', dishesSchema, 'dishes');