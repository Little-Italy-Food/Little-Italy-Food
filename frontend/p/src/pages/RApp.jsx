import React, { useState, useEffect } from "react";
import axios from "axios";

function RApp() {
  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null); // State to hold selected recipe details

  useEffect(() => {
    if (
      !("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      alert("Your browser does not support Speech Recognition");
    }
  }, []);

  const handleAddIngredient = () => {
    if (input) {
      setIngredients([...ingredients, input]);
      setInput("");
    }
  };

  const handleDeleteIngredient = (ingredient) => {
    setIngredients(ingredients.filter((ing) => ing !== ingredient));
  };

  const handleFindRecipes = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/recipes/find-recipes",
        {
          ingredients,
        }
      );
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes", error);
    }
  };

  // Fetch detailed recipe information
  const handleRecipeClick = async (recipeId) => {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${recipeId}/information`,
        {
          params: {
            apiKey: "c280ca0a9b9a4b69905d8dbee2ad9524", // Replace with your Spoonacular API key
          },
        }
      );
      setSelectedRecipe(response.data);
    } catch (error) {
      console.error("Error fetching recipe details", error);
    }
  };

  // Voice search functionality
  const startVoiceSearch = () => {
    const recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!recognition) {
      alert("Speech Recognition API not supported in this browser.");
      return;
    }

    const recognitionInstance = new recognition();
    recognitionInstance.lang = "en-US";
    recognitionInstance.interimResults = false;

    recognitionInstance.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setInput(result);
      handleAddIngredient();
    };

    recognitionInstance.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };

    recognitionInstance.start();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-xl mx-auto bg-white shadow p-5">
        <h1 className="text-2xl font-bold mb-4">
          Recipe with What’s in My Kitchen
        </h1>

        <div className="flex">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border p-2 flex-grow"
            placeholder="Enter an ingredient"
          />
          <button
            onClick={handleAddIngredient}
            className="bg-blue-500 text-white p-2 ml-2"
          >
            Add
          </button>
          <button
            onClick={startVoiceSearch}
            className="bg-purple-500 text-white p-2 ml-2"
          >
            🎙️
          </button>
        </div>

        <div className="mt-4">
          {ingredients.map((ing, index) => (
            <div
              key={index}
              className="inline-block bg-gray-200 p-2 rounded-full mr-2 mb-2 flex items-center"
            >
              <span className="mr-2">{ing}</span>
              <button
                onClick={() => handleDeleteIngredient(ing)}
                className="text-red-500 hover:text-red-700"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleFindRecipes}
          className="mt-4 bg-green-500 text-white p-2 w-full"
        >
          Find Recipes
        </button>

        <div className="mt-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="border-b py-2 cursor-pointer"
              onClick={() => handleRecipeClick(recipe.id)} // Add click handler
            >
              <h3 className="font-bold">{recipe.title}</h3>
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-32 h-32"
              />
            </div>
          ))}
        </div>

        {selectedRecipe && (
          <div className="mt-4 border p-4 bg-white shadow">
            <h2 className="text-xl font-bold mb-2">{selectedRecipe.title}</h2>
            <img
              src={selectedRecipe.image}
              alt={selectedRecipe.title}
              className="w-64 h-64 mb-4"
            />
            <p>
              <strong>Ready in:</strong> {selectedRecipe.readyInMinutes} minutes
            </p>
            <p>
              <strong>Servings:</strong> {selectedRecipe.servings}
            </p>
            <h3 className="font-bold mt-2">Ingredients:</h3>
            <ul className="list-disc ml-5">
              {selectedRecipe.extendedIngredients.map((ingredient) => (
                <li key={ingredient.id}>{ingredient.original}</li>
              ))}
            </ul>
            <h3 className="font-bold mt-2">Instructions:</h3>
            <p>{selectedRecipe.instructions}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RApp;
