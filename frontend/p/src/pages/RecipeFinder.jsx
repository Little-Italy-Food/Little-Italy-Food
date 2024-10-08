import React, { useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { saveAs } from "file-saver";
import {
  Mic,
  Plus,
  X,
  Search,
  Download,
  Clock,
  Users,
  ChefHat,
  Utensils,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Button = ({ children, className, ...props }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`px-4 py-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

const Input = ({ className, ...props }) => (
  <motion.input
    whileFocus={{ scale: 1.02 }}
    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm ${className}`}
    {...props}
  />
);

const Badge = ({ children, className, ...props }) => (
  <motion.span
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-colors ${className}`}
    {...props}
  >
    {children}
  </motion.span>
);

const Card = ({ children, className, ...props }) => (
  <motion.div
    whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
    className={`bg-white shadow-lg rounded-lg overflow-hidden transition-all ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

const Dialog = ({ open, onClose, children }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-auto shadow-xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  const sliderImages = [
    "./src/assets/food7.jpg",
    "./src/assets/food8.jpg",
    "./src/assets/food9.jpg",
    "./src/assets/food10.jpg",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6 sm:p-10">
      <div className="w-full max-w-7xl mx-auto">
        <Slider {...sliderSettings} className="mb-12">
          {sliderImages.map((image, index) => (
            <div key={index} className="h-96 relative">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute inset-0 flex items-center justify-center text-5xl sm:text-6xl font-extrabold text-white"
              >
                Recipe Finder
              </motion.h1>
            </div>
          ))}
        </Slider>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-lg mb-10"
        >
          <h2 className="text-2xl font-bold text-orange-700 mb-6 flex items-center">
            <ChefHat className="w-6 h-6 mr-2" />
            How to Use
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Welcome to Recipe Finder! Start by entering ingredients you have on
            hand. You can add multiple ingredients, and we'll help you find
            recipes that you can make with them.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            You can also use voice input to add ingredients quickly. Just click
            the microphone icon and speak your ingredient.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Once you've added your ingredients, click "Search Recipes" to find
            recipes. Click on a recipe card to see more details, download the
            recipe, or explore similar recipes.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter an ingredient"
            className="flex-grow focus:border-orange-500"
          />
          <Button
            onClick={handleAddIngredient}
            className="bg-orange-600 text-white hover:bg-orange-700"
          >
            <Plus className="w-5 h-5 mr-2 inline" />
            Add
          </Button>
          <Button
            onClick={handleVoiceInput}
            className="bg-orange-400 text-white hover:bg-orange-500 relative"
          >
            <Mic
              className={`w-5 h-5 inline ${isListening ? "text-red-500" : ""}`}
            />
            {isListening && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
            )}
          </Button>
        </div>

        <AnimatePresence>
          {ingredients.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-wrap items-center gap-3 mb-6"
            >
              {ingredients.map((ingredient) => (
                <Badge
                  key={ingredient}
                  className="bg-orange-100 text-orange-600 border-orange-600"
                >
                  {ingredient}
                  <button
                    onClick={() => handleDeleteIngredient(ingredient)}
                    className="ml-2 text-orange-600 hover:text-orange-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </Badge>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          onClick={handleFindRecipes}
          className="bg-orange-600 text-white hover:bg-orange-700 w-full sm:w-auto mx-auto block py-3 px-6 rounded-lg shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out flex items-center justify-center"
        >
          <Search className="w-5 h-5 mr-2 inline" />
          Search Recipes
        </Button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10"
        >
          {recipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="cursor-pointer"
              onClick={() => handleRecipeClick(recipe.id)}
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {recipe.title}
                </h3>
                <p className="text-gray-500 flex items-center">
                  <Utensils className="w-4 h-4 mr-2" />
                  Uses {recipe.usedIngredientCount} ingredients from your list
                </p>
              </div>
            </Card>
          ))}
        </motion.div>

        <Dialog
          open={Boolean(selectedRecipe)}
          onClose={() => setSelectedRecipe(null)}
        >
          {selectedRecipe && (
            <>
              <h2 className="text-3xl font-bold mb-4">
                {selectedRecipe.title}
              </h2>
              <p className="text-gray-600 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Ready in {selectedRecipe.readyInMinutes} minutes
                <Users className="w-5 h-5 ml-4 mr-2" />
                Serves {selectedRecipe.servings}
              </p>
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <Utensils className="w-5 h-5 mr-2" />
                Ingredients
              </h3>
              <ul className="list-disc list-inside mb-6">
                {selectedRecipe.extendedIngredients.map((ingredient) => (
                  <li key={ingredient.id} className="text-gray-800">
                    {ingredient.original}
                  </li>
                ))}
              </ul>
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <ChefHat className="w-5 h-5 mr-2" />
                Instructions
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                {selectedRecipe.instructions}
              </p>
              <Button
                onClick={handleDownloadRecipe}
                className="bg-orange-600 text-white hover:bg-orange-700"
              >
                <Download className="w-5 h-5 mr-2 inline" />
                Download Recipe
              </Button>

              <h3 className="text-xl font-semibold mt-10 mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Similar Recipes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarRecipes.map((recipe) => (
                  <Card
                    key={recipe.id}
                    className="cursor-pointer"
                    onClick={() => handleRecipeClick(recipe.id)}
                  >
                    <img
                      src={`https://spoonacular.com/recipeImages/${recipe.id}-312x231.jpg`}
                      alt={recipe.title}
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        {recipe.title}
                      </h4>
                      <p className="text-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Ready in {recipe.readyInMinutes} minutes
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </Dialog>
      </div>
    </div>
  );
};

export default RecipeFinder;
