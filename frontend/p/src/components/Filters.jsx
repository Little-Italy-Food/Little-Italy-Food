import React, { useState } from "react";
import m1 from "../assets/m1-removebg-preview.png";
import m2 from "../assets/m2-removebg-preview.png";
import m3 from "../assets/m3-removebg-preview.png";

import Modal1 from "./model/Modal1";

import {
  Sliders,
  Clock,
  Book,
  Utensils,
  SortAsc,
  SortDesc,
  CheckSquare,
} from "lucide-react";

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

  const FilterSection = ({ label, children }) => (
    <div className="flex flex-col 1">
      <label className="mb-2 font-semibold text-gray-700 flex items-center">
        {label}
      </label>
      {children}
    </div>
  );

  const medalsData = [
    {
      src: m1,
      title: "Title for m1",
      text: "This is static text for m1.",
    },
    {
      src: m2,
      title: "Title for m2",
      text: "This is static text for m2.",
    },
    {
      src: m3,
      title: "Title for m3",
      text: "This is static text for m3.",
    },
  ];

  const CheckboxSection = ({ label, checked, onChange }) => (
    <div className="flex items-center mb-1 mt-7  ">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-[#FF5733] focus:ring-[#FF5733] border-gray-300 rounded"
      />
      <label className="ml-2 font-semibold text-gray-700 flex items-center">
        {label}
      </label>
    </div>
  );

  return (
    <>
      <div
        className="w-full p-6 -mt-5 bg-white rounded-lg z-50 space-y-6 "
        style={{
          boxShadow: "1px 1px 14px 1px rgba(255,87,51,0.5)",
        }}
      >
        <h2 className="text-2xl font-bold mb-6 text-[#FF5733] flex items-center">
          <Sliders className="mr-2" /> Recipe Filters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FilterSection
            label={
              <>
                <Clock className="mr-1" /> Cooking Time (mins)
              </>
            }
          >
            <input
              type="range"
              min="0"
              max="120"
              value={time}
              className="w-full h-2 bg-[#FF5733] rounded-lg appearance-none cursor-pointer"
              onChange={handleTimeChange}
            />
            <div className="text-right text-gray-600">{time} mins</div>
          </FilterSection>

          <FilterSection
            label={
              <>
                <Book className="mr-1" /> Number of Ingredients
              </>
            }
          >
            <input
              type="number"
              min="1"
              value={ingredients}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF5733]"
              onChange={handleIngredientsChange}
            />
          </FilterSection>

          <FilterSection
            label={
              <>
                <Utensils className="mr-1" /> Dietary Preferences
              </>
            }
          >
            <select
              className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#FF5733]"
              onChange={(e) => onFilterChange("diet", e.target.value)}
            >
              <option value="">All</option>
              <option value="gluten-free">Gluten-Free</option>
              <option value="vegan">Vegan</option>
              <option value="vegetarian">Vegetarian</option>
            </select>
          </FilterSection>

          <FilterSection
            label={
              <>
                <SortAsc className="mr-1" /> Sort By
              </>
            }
          >
            <select
              className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#FF5733]"
              value={sortBy}
              onChange={handleSortByChange}
            >
              <option value="">None</option>
              <option value="createdAt">Date Created</option>
              <option value="difficulty">Difficulty</option>
            </select>
          </FilterSection>

          {sortBy === "createdAt" && (
            <FilterSection
              label={
                <>
                  <SortDesc className="mr-1" /> Sort Order
                </>
              }
            >
              <select
                className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#FF5733]"
                value={sortOrder}
                onChange={handleSortOrderChange}
              >
                <option value="asc">Oldest First</option>
                <option value="desc">Newest First</option>
              </select>
            </FilterSection>
          )}

          {sortBy === "difficulty" && (
            <FilterSection label="Difficulty">
              <select
                className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#FF5733]"
                value={difficulty}
                onChange={handleDifficultyChange}
              >
                <option value="">All</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="difficult">Difficult</option>
              </select>
            </FilterSection>
          )}

          <CheckboxSection
            label={
              <>
                <CheckSquare className="mr-2 text-[#FF5733]" /> Meal Prep
                Friendly
              </>
            }
            checked={mealPrepFriendly}
            onChange={handleMealPrepFriendlyChange}
          />
          <CheckboxSection
            label={
              <>
                <CheckSquare className="mr-1 text-[#FF5733]" /> Freezable Recipe
              </>
            }
            checked={freezableRecipe}
            onChange={handleFreezableRecipeChange}
          />
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          {medalsData.map((medal, index) => (
            <div
              key={index}
              className="medal text-yellow-800 rounded-md cursor-pointer transition-transform hover:scale-110"
              onClick={() => openModal(medal.src, medal.title, medal.text)}
            >
              <img
                src={medal.src}
                alt={`Medal ${index + 1}`}
                className="w-24 h-24"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-[17rem] left-[22.5rem] z-50">
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
                    ? "bg-[#FF5733] text-white"
                    : "bg-white text-[#FF5733]"
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
                    ? "bg-[#FF5733] text-white"
                    : "bg-white text-[#FF5733]"
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
