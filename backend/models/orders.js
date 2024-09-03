const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  chefId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chefs', required: true },
  dishId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dishes', required: true }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'canceled', 'completed'], 
    default: 'pending' 
  },
  orderDate: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
  paypalOrderId: { type: String, required: true },
  discountCode: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model('Orders', ordersSchema, 'orders');