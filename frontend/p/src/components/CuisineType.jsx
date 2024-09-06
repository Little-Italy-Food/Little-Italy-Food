import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock, Users, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const CuisineType = ({ cuisineType }) => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/recipes/recipes/cuisine/${cuisineType}`
        );
        setRecipes(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [cuisineType]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#FF5733]"></div>
      </div>
    );

  if (error)
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Similar Recipes for {cuisineType} Cuisine
      </h1>
      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={`http://localhost:5001/${recipe.mainImage}`}
                  alt={recipe.name}
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                  {recipe.name}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {recipe.briefDescription}
                </p>
                <div className="flex items-center text-gray-700 mb-2">
                  <Users size={20} className="mr-2" />
                  <span>Servings: {recipe.servings}</span>
                </div>
                <div className="flex items-center text-gray-700 mb-4">
                  <Clock size={20} className="mr-2" />
                  <span>
                    Cooking Time: {recipe.cookingTime.hours}h{" "}
                    {recipe.cookingTime.minutes}m
                  </span>
                </div>
                <Link
                  to={`/recipe/${recipe._id}`}
                  className="inline-flex items-center  px-4 py-2 bg-[#FF5733] text-white rounded-md hover:opacity-70 transition-colors duration-300"
                >
                  Read More
                  <ChevronRight size={20} className="ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-xl">
          No recipes found for {cuisineType}
        </p>
      )}
    </div>
  );
};

export default CuisineType;
