const Rating = require('../models/ratings');
const Dish = require('../models/dishes');

exports.getRatingsByDishId = async (req, res) => {
  try {
    const { dishId } = req.params;
    const ratings = await Rating.find({ dishId });
    const totalRatings = ratings.length;
    const averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings || 0;
    
    let userRating = null;
    if (req.user) {
      const userRatingDoc = await Rating.findOne({ dishId, userId: req.user.id });
      if (userRatingDoc) {
        userRating = userRatingDoc.rating;
      }
    }

    res.json({ averageRating, totalRatings, userRating });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ratings', error: error.message });
  }
};

exports.addRating = async (req, res) => {
  try {
    const { dishId, rating } = req.body;
    const userId = req.user.id;

    let ratingDoc = await Rating.findOne({ dishId, userId });
    if (ratingDoc) {
      ratingDoc.rating = rating;
    } else {
      ratingDoc = new Rating({ dishId, userId, rating });
    }
    await ratingDoc.save();

    const ratings = await Rating.find({ dishId });
    const averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
    await Dish.findByIdAndUpdate(dishId, { averageRating });

    res.status(201).json(ratingDoc);
  } catch (error) {
    res.status(500).json({ message: 'Error adding rating', error: error.message });
  }
};