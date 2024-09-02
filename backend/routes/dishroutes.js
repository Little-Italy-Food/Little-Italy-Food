const express = require('express');
const router = express.Router();
const {
  addDish,
  getDishesByChef,
  updateDish,
  deleteDish,
} = require('../controllers/dishcontroller');

router.post('/', addDish);
router.get('/:chefId', getDishesByChef);
router.put('/:dishId', updateDish);
router.delete('/:dishId', deleteDish);

module.exports = router;
