const express = require('express');
const router = express.Router();
const { register, login,getAllUsers,getCurrentUser } = require('../controllers/usercontoller');
const auth = require('../middlewares/auth');



router.post('/register', register);
router.post('/login', login);
router.get('/', getAllUsers);  
router.get('/me', auth, getCurrentUser);  // New route
module.exports = router;