const express = require('express');
const router = express.Router();
const DiscountCode = require('../models/discount');

router.post('/validate-discount', async (req, res) => {
  try {
    const { code } = req.body;
    const discountCode = await DiscountCode.findOne({ code: code, isActive: true });

    if (!discountCode) {
      return res.status(404).json({ message: 'Invalid or expired discount code' });
    }

    res.json({ discount: discountCode.discountAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;