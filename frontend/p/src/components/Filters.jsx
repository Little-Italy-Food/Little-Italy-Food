import React, { useState } from "react";

const Filters = ({ onFilterChange }) => {
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [difficulty, setDifficulty] = useState("");
  const [time, setTime] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [mealType, setMealType] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [mealPrepFriendly, setMealPrepFriendly] = useState(false);
  const [freezableRecipe, setFreezableRecipe] = useState(false);

  const handleSortByChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    onFilterChange("sortBy", value);
  };

  const handleSortOrderChange = (e) => {
    const value = e.target.value;
    setSortOrder(value);
    onFilterChange("sortOrder", value);
  };

  const handleDifficultyChange = (e) => {
    const value = e.target.value;
    setDifficulty(value);
    onFilterChange("difficulty", value);
  };

  const handleTimeChange = (e) => {
    const value = e.target.value;
    setTime(value);
    onFilterChange("time", value);
  };

  const handleIngredientsChange = (e) => {
    const value = e.target.value;
    setIngredients(value);
    onFilterChange("ingredients", value);
  };

  const handleMealTypeChange = (type) => {
    setMealType(type);
    onFilterChange("mealType", type);
  };

  const handleCuisineTypeChange = (type) => {
    setCuisineType(type);
    onFilterChange("cuisineType", type);
  };

  const handleMealPrepFriendlyChange = (e) => {
    const checked = e.target.checked;
    setMealPrepFriendly(checked);
    onFilterChange("mealPrepFriendly", checked);
  };

  const handleFreezableRecipeChange = (e) => {
    const checked = e.target.checked;
    setFreezableRecipe(checked);
    onFilterChange("freezableRecipe", checked);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-4 bg-gray-100 rounded-lg shadow-md">
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-700">
            Cooking Time (mins):
          </label>
          <input
            type="range"
            min="0"
            max="120"
            value={time}
            className="w-full h-2 bg-blue-300 rounded-lg"
            onChange={handleTimeChange}
          />
          <div className="text-right text-gray-600">{time} mins</div>
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-700">
            Number of Ingredients:
          </label>
          <input
            type="number"
            min="1"
            value={ingredients}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            onChange={handleIngredientsChange}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-700">
            Dietary Preferences:
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-blue-500"
            onChange={(e) => onFilterChange("diet", e.target.value)}
          >
            <option value="">All</option>
            <option value="gluten-free">Gluten-Free</option>
            <option value="vegan">Vegan</option>
            <option value="vegetarian">Vegetarian</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-700">Sort By:</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-blue-500"
            value={sortBy}
            onChange={handleSortByChange}
          >
            <option value="">None</option>
            <option value="createdAt">Date Created</option>
            <option value="difficulty">Difficulty</option>
          </select>
        </div>

        {sortBy === "createdAt" && (
          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">
              Sort Order:
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-blue-500"
              value={sortOrder}
              onChange={handleSortOrderChange}
            >
              <option value="asc">Oldest First</option>
              <option value="desc">Newest First</option>
            </select>
          </div>
        )}

        {sortBy === "difficulty" && (
          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">
              Difficulty:
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-blue-500"
              value={difficulty}
              onChange={handleDifficultyChange}
            >
              <option value="">All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="difficult">Difficult</option>
            </select>
          </div>
        )}
        <div className="flex justify-center"></div>
        <div className="flex items-center">
          <label className="mb-2 font-semibold text-gray-700">
            Meal Prep Friendly:
          </label>
          <input
            type="checkbox"
            checked={mealPrepFriendly}
            onChange={handleMealPrepFriendlyChange}
            className="ml-2"
          />
        </div>

        <div className="flex items-center">
          <label className="mb-2 font-semibold text-gray-700">
            Freezable Recipe:
          </label>
          <input
            type="checkbox"
            checked={freezableRecipe}
            onChange={handleFreezableRecipeChange}
            className="ml-2"
          />
        </div>
      </div>

      <div className="flex flex-col items-center mb-5">
        <label className="mb-2">Meal Type:</label>
        <div className="flex space-x-2">
          {[
            "",
            "breakfast",
            "lunch",
            "dinner",
            "snack",
            "appetizers",
            "dessert",
          ].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 border rounded ${
                mealType === type
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }`}
              onClick={() => handleMealTypeChange(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1) || "All"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center my-5">
        <label className="mb-2">Cuisine Type:</label>
        <div className="flex space-x-2">
          {["", "pizza", "pasta", "soup", "salad", "seafood"].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 border rounded ${
                cuisineType === type
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }`}
              onClick={() => handleCuisineTypeChange(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1) || "All"}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Filters;
