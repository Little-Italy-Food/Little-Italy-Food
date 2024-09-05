const mongoose = require('mongoose');
const { Schema } = mongoose;

const reportSchema = new Schema({
  reporterId: {
    type: Schema.Types.ObjectId,
    ref: 'Users', // Reference to the Users model
    required: true,
  },
  dishId: {
    type: Schema.Types.ObjectId,
    ref: 'Dishes', // Reference to the Dishes model
    required: false, // Optional, as the report could be for a recipe or comment instead
  },
  recipeId: {
    type: Schema.Types.ObjectId,
    ref: 'Recipes', // Reference to the Recipes model
    required: false, // Optional, as the report could be for a dish or comment instead
  },
  commentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comments', // Reference to the Comments model
    required: false, // Optional, as the report could be for a dish or recipe instead
  },
  reason: {
    type: String,
    required: true, // Reason for the report
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Resolved'],
    default: 'Pending',
  },
});

const Reports = mongoose.model('Reports', reportSchema);

module.exports = Reports;
