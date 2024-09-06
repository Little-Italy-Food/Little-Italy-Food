const Order = require('../models/orders');
const User = require("../models/users");

const userprofilecontroller = {
  createOrder: async (req, res) => {
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
  },

  getUserOrders: async (req, res) => {
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
  },

  getOrderById: async (req, res) => {
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
  },

  getUserInfo: async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log('Fetching user info for userId:', userId);
      console.log('User object from request:', req.user);
      
      if (req.user.id !== userId) {
        return res.status(403).json({ message: "Not authorized to access this user's information" });
      }

      const user = await User.findById(userId).select('username email image');
      
      if (!user) {
        console.log('User not found for userId:', userId);
        return res.status(404).json({ message: "User not found" });
      }

      console.log('User found:', user);
      res.json({
        username: user.username,
        email: user.email,
        image: user.image
      });
    } catch (error) {
      console.error('Error in getUserInfo:', error);
      res.status(500).json({ message: "Error fetching user data" });
    }
  },

  updateUserInfo: async (req, res) => {
    try {
      const userId = req.params.userId;
      const { username, email, image } = req.body;
      console.log('Updating user info for userId:', userId);
      console.log('Update data:', { username, email, image });

      if (req.user.id !== userId) {
        return res.status(403).json({ message: "Not authorized to update this user's information" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { username, email, image },
        { new: true, runValidators: true }
      ).select('username email image');

      if (!updatedUser) {
        console.log('User not found for update, userId:', userId);
        return res.status(404).json({ message: "User not found" });
      }

      console.log('User updated:', updatedUser);
      res.json({
        username: updatedUser.username,
        email: updatedUser.email,
        image: updatedUser.image
      });
    } catch (error) {
      console.error('Error in updateUserInfo:', error);
      res.status(500).json({ message: "Error updating profile" });
    }
  }
};

module.exports = userprofilecontroller