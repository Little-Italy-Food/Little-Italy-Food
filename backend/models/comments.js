const mongoose = require('mongoose');

// Define the main comments schema
const commentsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  dishId: { type: mongoose.Schema.Types.ObjectId, ref: 'dishes', required: true },
  content: { type: String, required: true },
  replies: [
    {
      replyContent: { type: String, required: true },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    },
  ],
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Comments', commentsSchema, 'comments');
