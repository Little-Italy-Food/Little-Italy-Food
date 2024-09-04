const express = require('express');
const router = express.Router();
const Chef = require('../models/chefs');

router.get('/', async (req, res) => {
  try {
    const chefs = await Chef.find().select('-password');
    res.json(chefs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id).select('-password');
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }
    res.json(chef);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;