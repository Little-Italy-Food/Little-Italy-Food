import React, { useState } from "react";
import m1 from "../assets/m1-removebg-preview.png";
import m2 from "../assets/m2-removebg-preview.png";
import m3 from "../assets/m3-removebg-preview.png";

import Modal1 from "./model/Modal1";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");

  const openModal = (imageSrc, title, text) => {
    setModalImage(imageSrc);
    setModalTitle(title);
    setModalText(text);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage("");
    setModalTitle("");
    setModalText("");
  };

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
      <div
        className="w-96 p-4 bg-gray-100 rounded-lg  z-50 flex flex-col space-y-6 ml-[4rem]  absolute top-[40rem]"
        style={{
          boxShadow: "1px 1px 14px 1px rgba(255,87,51,1)",
        }}
      >
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-700">
            Cooking Time (mins):
          </label>
          <input
            type="range"
            min="0"
            max="120"
            value={time}
            className="w-full h-2 bg-green-500 rounded-lg"
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
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            onChange={handleIngredientsChange}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-700">
            Dietary Preferences:
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-green-500"
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
            className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-green-500"
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
              className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-green-500"
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
              className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-green-500"
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

        <div className="flex items-center">
          <label className="mr-2 font-semibold text-gray-700">
            Meal Prep Friendly:
          </label>
          <input
            type="checkbox"
            checked={mealPrepFriendly}
            onChange={handleMealPrepFriendlyChange}
          />
        </div>

        <div className="flex items-center">
          <label className="mr-2 font-semibold text-gray-700">
            Freezable Recipe:
          </label>
          <input
            type="checkbox"
            checked={freezableRecipe}
            onChange={handleFreezableRecipeChange}
          />
        </div>

        <div className="flex justify-center">
          <div
            className="medal text-yellow-800 rounded-md cursor-pointer"
            onClick={() =>
              openModal(m1, "Title for m1", "This is static text for m1.")
            }
          >
            <img src={m1} alt="Medal" className="w-24 h-24" />
          </div>
          <div
            className="medal text-yellow-800 rounded-md cursor-pointer"
            onClick={() =>
              openModal(m2, "Title for m2", "This is static text for m2.")
            }
          >
            <img src={m2} alt="Medal" className="w-24 h-24" />
          </div>
          <div
            className="medal text-yellow-800 rounded-md cursor-pointer"
            onClick={() =>
              openModal(m3, "Title for m3", "This is static text for m3.")
            }
          >
            <img src={m3} alt="Medal" className="w-24 h-24" />
          </div>
        </div>
      </div>

      <div className="absolute top-[15rem] left-[25rem] z-50">
        <div className="font-sans p-4">
          <ul className="flex gap-4 bg-gray-100 rounded-2xl p-1 w-max overflow-hidden">
            {[
              "",
              "breakfast",
              "lunch",
              "dinner",
              "snack",
              "appetizers",
              "dessert",
            ].map((type) => (
              <li
                key={type}
                className={`tab text-gray-600 rounded-2xl font-semibold text-center text-sm py-3 px-6 tracking-wide cursor-pointer ${
                  mealType === type
                    ? "bg-green-500 text-white"
                    : "bg-white text-green-500"
                }`}
                onClick={() => handleMealTypeChange(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1) || "All"}
              </li>
            ))}
          </ul>

          {/* Content areas can be added here if needed */}
        </div>

        <div className="font-sans p-4 ml-[6rem]">
          <ul className="flex gap-4 bg-gray-100 rounded-2xl p-1 w-max overflow-hidden">
            {["", "pizza", "pasta", "soup", "salad", "seafood"].map((type) => (
              <li
                key={type}
                className={`tab text-gray-600 rounded-2xl font-semibold text-center text-sm py-3 px-6 tracking-wide cursor-pointer ${
                  cuisineType === type
                    ? "bg-green-500 text-white"
                    : "bg-white text-green-500"
                }`}
                onClick={() => handleCuisineTypeChange(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1) || "All"}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="z-50">
        <Modal1
          isOpen={isModalOpen}
          onClose={closeModal}
          imageSrc={modalImage}
          title={modalTitle}
          text={modalText}
        />
      </div>
    </>
  );
};

export default Filters;
