const mongoose = require('mongoose');

const discountCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountAmount: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  expirationDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('DiscountCode', discountCodeSchema,'discounts');