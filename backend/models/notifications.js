const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationsSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'Users', // Assuming User is the model for users
    required: true,
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'Users', // Assuming User is the model for users
    required: true,
  },
  dishId: {
    type: Schema.Types.ObjectId,
    ref: 'Dishes', // Assuming Dishes is the model for dishes
    required: false, // Optional if not all notifications are related to a dish
  },
  recipeId: {
    type: Schema.Types.ObjectId,
    ref: 'Recipes', // Assuming Recipes is the model for recipes
    required: false, // Optional if not all notifications are related to a recipe
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

const Notifications = mongoose.model('Notifications', notificationsSchema,'notifications');

module.exports = Notifications;
