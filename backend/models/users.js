const mongoose = require('mongoose');
const { Schema } = mongoose;

const usersSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  subscriptions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Chefs', 
    }
  ],
});

module.exports = mongoose.model('Users', usersSchema, 'users');
