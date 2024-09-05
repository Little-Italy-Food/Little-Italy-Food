import React, { useState, useEffect } from "react";
import RecipeCard from "../components/RecipeCard";

const ForYou = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const storedRecipes =
      JSON.parse(localStorage.getItem("searchResults")) || [];
    setRecipes(storedRecipes);
  }, []);

  return (
    <>
      <div className="flex justify-start absolute left-[40rem] ">
        <div className="container mx-auto mt-8 mb-14">
          <h2 className="text-2xl font-bold mb-4">For You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.length > 0 ? (
              recipes.map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} />
              ))
            ) : (
              <p>No saved recipes found.</p>
            )}
          </div>
        </div>
      </div>
      <br />
    </>
  );
};

export default ForYou;
