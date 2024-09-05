const mongoose = require('mongoose');

const chefsSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  image: { type: String, default: "" },
});

module.exports = mongoose.model('Chefs', chefsSchema,'chefs');