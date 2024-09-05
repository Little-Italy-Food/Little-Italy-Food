import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";

const RecipeView = () => {
  const location = useLocation();
  const { id } = useParams();
  const [recipe, setRecipe] = useState(location.state?.recipe || null);

  useEffect(() => {
    if (!recipe) {
      axios
        .get(`http://localhost:5001/api/recipes/recipes-info/${id}`)
        .then((response) => setRecipe(response.data))
        .catch((error) => console.error("Error fetching recipe:", error));
    }
  }, [id, recipe]);

  if (!recipe) {
    return <div>Loading recipe data...</div>;
  }

  return (
    <div>
      <h1>{recipe.name}</h1>
      <img
        src={`http://localhost:5001/${recipe.mainImage}`}
        alt={recipe.name}
      />
      <p>{recipe.comprehensiveDescription}</p>
    </div>
  );
};

export default RecipeView;
