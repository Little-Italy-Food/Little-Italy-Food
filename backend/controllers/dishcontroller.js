const Dish = require('../models/dishes');
const mongoose = require('mongoose');

exports.addDish = async (req, res) => {
  try {
    const { title, description, category, ingredients, price, chefId } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(chefId)) {
      return res.status(400).json({ error: "Invalid chefId format" });
    }

    const newDish = new Dish({ title, description, category, ingredients, price, chefId });
    await newDish.save();
    res.status(201).json(newDish);
  } catch (error) {
    console.error("Error in addDish:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getDishesByChef = async (req, res) => {
  try {
    const { chefId } = req.params;

    // If chefId is "null" or an empty string, return an empty array
    if (chefId === "null" || chefId === "") {
      return res.json([]);
    }

    // Check if chefId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(chefId)) {
      return res.status(400).json({ error: "Invalid chefId format" });
    }

    const dishes = await Dish.find({ chefId, isDeleted: false });
    res.json(dishes);
  } catch (error) {
    console.error("Error in getDishesByChef:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateDish = async (req, res) => {
  try {
    const { dishId } = req.params;
    const updatedDish = await Dish.findByIdAndUpdate(dishId, req.body, { new: true });
    if (!updatedDish) {
      return res.status(404).json({ error: "Dish not found" });
    }
    res.json(updatedDish);
  } catch (error) {
    console.error("Error in updateDish:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteDish = async (req, res) => {
  try {
    const { dishId } = req.params;
    const deletedDish = await Dish.findByIdAndUpdate(dishId, { isDeleted: true }, { new: true });
    if (!deletedDish) {
      return res.status(404).json({ error: "Dish not found" });
    }
    res.json({ msg: 'Dish deleted successfully' });
  } catch (error) {
    console.error("Error in deleteDish:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};