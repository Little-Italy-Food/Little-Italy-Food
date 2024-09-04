import React from "react";

const baseURL = "http://localhost:5001/";

const RecipeCard = ({ recipe }) => {
  if (!recipe) return null; // Check if recipe exists

  const mainImageUrl = `${baseURL}${recipe.mainImage}`;

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative w-64 h-80 transform hover:scale-105 transition-transform duration-300">
        {/* Main book shape */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg shadow-lg transform -rotate-6"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-200 rounded-lg shadow-md transform rotate-12"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg shadow-lg transform rotate-6"></div>

        {/* Content area */}
        <div className="relative z-10 w-full h-full bg-white rounded-lg shadow-xl overflow-hidden flex flex-col items-center">
          {/* Image at the top with overlay */}
          <div className="relative w-full h-40">
            <img
              src={mainImageUrl}
              alt={recipe.name}
              className="w-full h-full object-cover rounded-t-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-lg"></div>
            <div className="absolute bottom-2 left-2 text-white text-sm font-medium bg-black/50 py-1 px-2 rounded-lg">
              {recipe.cuisine}
            </div>
          </div>

          <div className="p-4 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {recipe.name}
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              {recipe.briefDescription}
            </p>
            {/* Button */}
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition-colors duration-300">
              View Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
