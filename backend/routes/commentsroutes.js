const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentscontroller');
const auth = require('../middlewares/auth');

router.get('/dish/:dishId', commentsController.getCommentsByDishId);
router.post('/', auth, commentsController.addComment);
router.post('/:commentId/reply', auth, commentsController.addReply);

module.exports = router;