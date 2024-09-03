const express = require('express');
const router = express.Router();
const ratingsController = require('../controllers/ratingscontroller');
const auth = require('../middlewares/auth');

router.get('/dish/:dishId', ratingsController.getRatingsByDishId);
router.post('/', auth, ratingsController.addRating);

module.exports = router;