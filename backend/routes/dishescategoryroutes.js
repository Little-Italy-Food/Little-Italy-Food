const express = require('express');
const router = express.Router();
const dishesController = require('../controllers/dishcategorycontroller');

router.get('/', dishesController.getAllDishes);
router.get('/:id', dishesController.getDishById);

module.exports = router;