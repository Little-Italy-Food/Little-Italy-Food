// RecipeCard.js
import React from "react";

const baseURL = "http://localhost:5001/";

const RecipeCard = ({ recipe }) => {
  console.log(recipe);
  if (!recipe) return null; // Check if recipe exists

  const mainImageUrl = `${baseURL}${recipe.mainImage}`;
  console.log(mainImageUrl);
  return (
    <div className="recipe-card">
      <h2>{recipe.name}</h2>
      <p>{recipe.briefDescription}</p>
      <img src={mainImageUrl} alt={recipe.name} />
    </div>
  );
};

export default RecipeCard;
