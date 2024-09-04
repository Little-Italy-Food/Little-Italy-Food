import React from "react";
import RecipeDetails from "../components/RecipeDetails";

const sampleRecipe = {
  title: "Spaghetti Carbonara",
  coverImage: "path/to/image.jpg",
  description:
    "A classic Italian pasta dish made with eggs, cheese, pancetta, and pepper.",
  ingredients: [
    { name: "Spaghetti", alternative: "Linguine" },
    { name: "Pancetta", alternative: "Bacon" },
    // Add more ingredients
  ],
  steps: [
    {
      description: "Cook spaghetti according to package instructions.",
      image: "",
      video: "",
    },
    { description: "Cook pancetta in a pan.", image: "", video: "" },
    // Add more steps
  ],
  servingSize: 4,
  nutrition: { calories: 500 },
};

function RecipeDetailspage() {
  return (
    <div className="App">
      <RecipeDetails recipe={sampleRecipe} />
    </div>
  );
}

export default RecipeDetailspage;
