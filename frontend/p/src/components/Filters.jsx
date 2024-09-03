// src/components/Filters.jsx
import React from "react";

const Filters = ({ onFilterChange }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div>
        <label>Cooking Time (mins):</label>
        <input
          type="range"
          min="0"
          max="120"
          className="w-full"
          onChange={(e) => onFilterChange("time", e.target.value)}
        />
      </div>
      <div>
        <label>Number of Ingredients:</label>
        <input
          type="number"
          min="1"
          className="w-full"
          onChange={(e) => onFilterChange("ingredients", e.target.value)}
        />
      </div>
      <div>
        <label>Dietary Preferences:</label>
        <select
          className="w-full"
          onChange={(e) => onFilterChange("diet", e.target.value)}
        >
          <option value="">All</option>
          <option value="gluten-free">Gluten-Free</option>
          <option value="vegan">Vegan</option>
          <option value="vegetarian">Vegetarian</option>
        </select>
      </div>
      <div>
        <label>Meal Type:</label>
        <select
          className="w-full"
          onChange={(e) => onFilterChange("mealType", e.target.value)}
        >
          <option value="">All</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
          <option value="appetizers">Appetizers</option>
          <option value="dessert">Dessert</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
