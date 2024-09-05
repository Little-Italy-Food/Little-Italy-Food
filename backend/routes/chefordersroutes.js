const express = require('express');
const router = express.Router();
const orderController = require('../controllers/cheforderscontroller'); 

router.get('/chef/:chefId', orderController.getChefOrders);


router.put('/:orderId', orderController.updateOrderStatus);

module.exports = router;