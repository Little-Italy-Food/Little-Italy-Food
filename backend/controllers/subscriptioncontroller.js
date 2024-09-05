const User = require('../models/users');

exports.addSubscription = async (req, res) => {
  try {
    const { chefId, paypalOrderId } = req.body;
    
    // Find the user and update their subscriptions
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { subscriptions: chefId } },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Here you would typically also save the PayPal order ID and other subscription details

    res.json({ msg: 'Subscription added successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};