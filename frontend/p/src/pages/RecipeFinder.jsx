import React, { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { Mic, Plus, X, Search, Download } from "lucide-react";

const Button = ({ children, className, ...props }) => (
  <button
    className={`px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ className, ...props }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
);

const Badge = ({ children, className, ...props }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    {...props}
  >
    {children}
  </span>
);

const Card = ({ children, className, ...props }) => (
  <div
    className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </div>
);

const Dialog = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-auto">
        <button
          onClick={onClose}
          className="float-right text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        {children}
      </div>
    </div>
  );
};

const RecipeFinder = () => {
  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const [isListening, setIsListening] = useState(false);

  const handleAddIngredient = () => {
    if (input.trim()) {
      setIngredients([...ingredients, input.trim()]);
      setInput("");
    }
  };

  const handleDeleteIngredient = (ingredient) => {
    setIngredients(ingredients.filter((ing) => ing !== ingredient));
  };

  const handleFindRecipes = async () => {
    try {
      const apiKey = "c280ca0a9b9a4b69905d8dbee2ad9524";
      const ingredientList = ingredients.join(",");
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientList}&number=12&apiKey=${apiKey}`
      );
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes", error);
    }
  };

  const handleRecipeClick = async (recipeId) => {
    try {
      const apiKey = "c280ca0a9b9a4b69905d8dbee2ad9524";
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${recipeId}/information`,
        { params: { apiKey } }
      );
      setSelectedRecipe(response.data);

      const similarResponse = await axios.get(
        `https://api.spoonacular.com/recipes/${recipeId}/similar`,
        { params: { apiKey, number: 6 } }
      );
      setSimilarRecipes(similarResponse.data);
    } catch (error) {
      console.error("Error fetching recipe details or similar recipes", error);
    }
  };

  const handleVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const voiceInput = event.results[0][0].transcript;
      setInput(voiceInput);
      setIngredients([...ingredients, voiceInput]);
      recognition.stop();
    };

    recognition.onerror = (event) => {
      console.error("Voice recognition error", event.error);
      recognition.stop();
    };

    recognition.start();
  };

  const handleDownloadRecipe = () => {
    const recipeContent = `
      Title: ${selectedRecipe.title}
      Ready in: ${selectedRecipe.readyInMinutes} minutes
      Servings: ${selectedRecipe.servings}

      Ingredients:
      ${selectedRecipe.extendedIngredients
        .map((ingredient) => ingredient.original)
        .join("\n")}

      Instructions:
      ${selectedRecipe.instructions}
    `;
    const blob = new Blob([recipeContent], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, `${selectedRecipe.title}.txt`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-4 sm:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-center text-orange-700 mb-10">
          Recipe Finder
        </h1>

        {/* Instruction Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold text-orange-700 mb-4">
            How to Use:
          </h2>
          <p className="text-gray-700 mb-4">
            Welcome to Recipe Finder! Start by entering ingredients you have on
            hand in the input field. You can add multiple ingredients, and we'll
            help you find recipes that you can make with them.
          </p>
          <p className="text-gray-700 mb-4">
            You can also use voice input to add ingredients quickly. Just click
            the microphone icon and speak your ingredient.
          </p>
          <p className="text-gray-700">
            Once you've added your ingredients, click "Search Recipes" to find
            recipes. Click on a recipe card to see more details, download the
            recipe, or explore similar recipes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter an ingredient"
            className="flex-grow border border-orange-300 focus:border-orange-500 rounded-lg px-4 py-2 text-gray-800 shadow-sm focus:ring-2 focus:ring-orange-500 transition-all"
          />
          <Button
            onClick={handleAddIngredient}
            className="bg-orange-500 text-white hover:bg-orange-600 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2 inline" />
            Add
          </Button>
          <Button
            onClick={handleVoiceInput}
            className="bg-orange-400 text-white hover:bg-orange-500 relative rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center"
          >
            <Mic
              className={`w-5 h-5 inline ${isListening ? "text-red-500" : ""}`}
            />
            {isListening && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
            )}
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {ingredients.map((ing, index) => (
            <Badge
              key={index}
              className="bg-orange-100 text-orange-700 border border-orange-300 rounded-lg px-3 py-1"
            >
              {ing}
              <button
                onClick={() => handleDeleteIngredient(ing)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4 inline" />
              </button>
            </Badge>
          ))}
        </div>

        <Button
          onClick={handleFindRecipes}
          className="w-full bg-orange-600 text-white hover:bg-orange-700 rounded-lg shadow-lg transition-transform transform hover:scale-105 mb-8 flex items-center"
        >
          <Search className="w-5 h-5 mr-2 inline" />
          Search Recipes
        </Button>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="cursor-pointer hover:shadow-xl transition-shadow bg-white border border-gray-200 rounded-lg overflow-hidden transform hover:scale-105"
              onClick={() => handleRecipeClick(recipe.id)}
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg text-center text-orange-700">
                  {recipe.title}
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedRecipe} onClose={() => setSelectedRecipe(null)}>
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl mx-auto transition-transform transform hover:scale-105">
          <h2 className="text-3xl font-extrabold text-orange-700 mb-6">
            {selectedRecipe?.title}
          </h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <img
                src={selectedRecipe?.image}
                alt={selectedRecipe?.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="font-semibold text-orange-700">Ready in:</p>
                  <p>{selectedRecipe?.readyInMinutes} minutes</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-700">Servings:</p>
                  <p>{selectedRecipe?.servings}</p>
                </div>
              </div>
              <Button
                onClick={handleDownloadRecipe}
                className="w-full bg-orange-500 text-white hover:bg-orange-600 rounded-lg shadow-lg transition-transform transform hover:scale-105 mb-4 flex items-center"
              >
                <Download className="w-5 h-5 mr-2 inline" />
                Download Recipe
              </Button>
            </div>
            <div className="md:w-1/2">
              <div className="mb-6">
                <h3 className="font-bold text-xl text-orange-700 mb-3">
                  Ingredients:
                </h3>
                <ul className="list-disc ml-6">
                  {selectedRecipe?.extendedIngredients.map((ingredient) => (
                    <li key={ingredient.id} className="text-gray-700">
                      {ingredient.original}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-6">
                <h3 className="font-bold text-xl text-orange-700 mb-3">
                  Instructions:
                </h3>
                <p className="text-gray-700">{selectedRecipe?.instructions}</p>
              </div>
            </div>
          </div>

          <h3 className="font-bold text-2xl text-orange-700 mt-6 mb-4">
            Similar Recipes:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {similarRecipes.map((similarRecipe) => (
              <Card
                key={similarRecipe.id}
                className="cursor-pointer hover:shadow-xl transition-shadow bg-white border border-gray-200 rounded-lg overflow-hidden transform hover:scale-105"
                onClick={() => handleRecipeClick(similarRecipe.id)}
              >
                <img
                  src={`https://spoonacular.com/recipeImages/${similarRecipe.id}-312x231.jpg`}
                  alt={similarRecipe.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-semibold text-center text-sm text-orange-700">
                    {similarRecipe.title}
                  </h3>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default RecipeFinder;
