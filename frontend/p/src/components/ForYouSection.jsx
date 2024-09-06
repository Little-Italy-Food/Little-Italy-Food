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
      <div className="container mx-auto mb-14 px-20 bg-orange-200 h-[31rem] rounded-lg ">
        <h2 className="text-5xl text-center font-bold mb-4 pt-4">For You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {recipes.length > 0 ? (
            recipes.map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe} />
            ))
          ) : (
            <p className="col-span-full text-center">No saved recipes found.</p>
          )}
        </div>
      </div>

      <br />
    </>
  );
};

export default ForYou;
