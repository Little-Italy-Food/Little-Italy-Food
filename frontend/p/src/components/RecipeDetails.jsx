import React from "react";

const RecipeDetails = ({ recipe }) => {
  return (
    <div className="container mx-auto p-6">
      <div className="relative w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flipbook">
          <div className="page">
            <h1 className="text-2xl font-bold">{recipe.title}</h1>
            <img
              src={recipe.coverImage}
              alt={recipe.title}
              className="w-full h-auto mt-4 rounded-md shadow-md"
            />
            <p className="description mt-4 text-gray-700">
              {recipe.description}
            </p>
          </div>

          <div className="page">
            <h2 className="text-xl font-semibold">Ingredients</h2>
            <ul className="mt-4 list-disc list-inside">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="mt-2 flex items-center">
                  <input type="checkbox" className="mr-2" /> {ingredient.name}
                  <span className="text-gray-500 ml-2">
                    (Alternative: {ingredient.alternative})
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="page">
            <h2 className="text-xl font-semibold">Steps</h2>
            <ol className="mt-4 list-decimal list-inside">
              {recipe.steps.map((step, index) => (
                <li key={index} className="mt-4">
                  <p>{step.description}</p>
                  {step.image && (
                    <img
                      src={step.image}
                      alt={`Step ${index + 1}`}
                      className="mt-2 w-full h-auto rounded-md shadow-md"
                    />
                  )}
                  {step.video && (
                    <video
                      controls
                      src={step.video}
                      className="mt-2 w-full rounded-md"
                    ></video>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <div className="page">
            <h2 className="text-xl font-semibold">Serving Size</h2>
            <p className="mt-4 text-gray-700">
              Serves: {recipe.servingSize} people
            </p>
          </div>

          <div className="page">
            <h2 className="text-xl font-semibold">
              Nutrition & Dietary Information
            </h2>
            <p className="mt-4 text-gray-700">
              Calories: {recipe.nutrition.calories}
            </p>
            {/* Add more nutritional info as needed */}
          </div>
        </div>
      </div>

      <div className="comments-section mt-8">
        <h3 className="text-xl font-semibold">Comments</h3>
        {/* Render comments here */}
      </div>

      <div className="rating-section mt-4">
        <h3 className="text-xl font-semibold">Rating</h3>
        {/* Display star rating here */}
      </div>
    </div>
  );
};

export default RecipeDetails;
