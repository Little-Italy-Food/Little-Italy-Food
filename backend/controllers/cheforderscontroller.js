const Orders = require('../models/orders'); // Adjust the path as needed
const Users = require('../models/users'); // Adjust the path as needed

const orderController = {
  // Get all orders for a specific chef
  getChefOrders: async (req, res) => {
    try {
      const chefId = req.params.chefId;
      const orders = await Orders.find({ chefId: chefId, isDeleted: false })
        .sort({ orderDate: -1 })
        .populate({
          path: 'userId',
          select: 'email username subscriptions',
          model: Users
        })
        .lean();

      // Format the orders to include user information
      const formattedOrders = orders.map(order => ({
        ...order,
        user: {
          email: order.userId.email,
          username: order.userId.username,
          subscriptions: order.userId.subscriptions
        }
      }));

      res.json(formattedOrders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update order status
  updateOrderStatus: async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const { status } = req.body;

      if (!['pending', 'confirmed', 'canceled', 'completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const updatedOrder = await Orders.findByIdAndUpdate(
        orderId,
        { status: status },
        { new: true }
      ).populate({
        path: 'userId',
        select: 'email username subscriptions',
        model: Users
      });

      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Format the updated order to include user information
      const formattedOrder = {
        ...updatedOrder.toObject(),
        user: {
          email: updatedOrder.userId.email,
          username: updatedOrder.userId.username,
          subscriptions: updatedOrder.userId.subscriptions
        }
      };

      res.json(formattedOrder);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = orderController;