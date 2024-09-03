const express = require('express');
const router = express.Router();
const Order = require('../models/orders');
const auth = require('../middlewares/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { paypalOrderId, items, totalAmount, discountCode } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }

    const chefId = items[0].chefId;
    
    const newOrder = new Order({
      userId: req.user.id,
      chefId: chefId,
      dishId: items.map(item => item._id),
      totalAmount: totalAmount,
      status: 'confirmed',
      paypalOrderId: paypalOrderId,
      discountCode: discountCode
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({ orderId: savedOrder._id });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

router.get('/user', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('dishId', 'title price imageUrl')
      .populate('chefId', 'username email');

    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

router.get('/:orderId', auth, async (req, res) => {
  try {
    console.log('Fetching order with ID:', req.params.orderId);
    console.log('User ID:', req.user.id);

    const order = await Order.findOne({ _id: req.params.orderId, userId: req.user.id })
      .populate('dishId', 'title price imageUrl')
      .populate('chefId', 'username email')
      .lean();

    console.log('Fetched order:', JSON.stringify(order, null, 2));

    if (!order) {
      console.log('Order not found');
      return res.status(404).json({ msg: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ msg: 'Server error', error: error.toString(), stack: error.stack });
  }
});

module.exports = router;