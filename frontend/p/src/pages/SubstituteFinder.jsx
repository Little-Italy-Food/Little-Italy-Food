import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, Plus, Search } from "lucide-react";

const images = [
  "./src/assets/food1.jpg",
  "./src/assets/food2.jpg",
  "./src/assets/food3.jpg",
  "./src/assets/food4.jpg",
  "./src/assets/food5.jpg",
  "./src/assets/food6.jpg",
];

function SubstituteFinder() {
  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState("");
  const [substitutions, setSubstitutions] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(intervalId);
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

  const handleFindSubstitutes = async () => {
    try {
      const apiKey = "c280ca0a9b9a4b69905d8dbee2ad9524";

      const response = await axios.get(
        `https://api.spoonacular.com/food/ingredients/substitutes`,
        {
          params: {
            apiKey: apiKey,
            ingredientName: ingredients[0],
          },
        }
      );

      if (response.data.substitutes && response.data.substitutes.length > 0) {
        setSubstitutions(response.data);
        setErrorMessage(null);
      } else {
        setSubstitutions(null);
        setErrorMessage(`No substitutes found for ${ingredients[0]}.`);
      }
    } catch (error) {
      console.error("Error fetching substitutions", error);
      setErrorMessage(
        "An error occurred while fetching substitutions. Please try again later."
      );
    }
  };

  const handleVoiceSearch = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex flex-col items-center">
      {/* Hero Section */}
      <motion.div
        className="relative w-full h-96 overflow-hidden  shadow-lg"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt="Hero"
            className="w-full h-full object-cover"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.h1
            className="text-6xl font-extrabold text-white text-center drop-shadow-md"
            initial={{ y: 50, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Find Ingredient Substitutes
          </motion.h1>
        </div>
      </motion.div>

      <motion.div
        className="w-full max-w-5xl mx-auto bg-white shadow-xl rounded-lg p-10 mt-8 mb-20"
        initial={{ y: 50, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Easily Find Substitutions for Your Ingredients
        </h1>

        <div className="flex flex-col md:flex-row mb-8 items-center">
          <div className="relative w-full md:w-2/3 mb-4 md:mb-0 md:mr-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full border border-gray-300 rounded-full p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter an ingredient"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex space-x-4">
            <motion.button
              onClick={handleAddIngredient}
              className="bg-orange-500 text-white rounded-full p-4 shadow-md hover:bg-orange-600 transition-all duration-300 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="mr-2" /> Add Ingredient
            </motion.button>
            <motion.button
              onClick={handleVoiceSearch}
              className={`bg-orange-400 text-white rounded-full p-4 shadow-md hover:bg-orange-500 transition-all duration-300 flex items-center ${
                isListening ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isListening}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mic className="mr-2" />{" "}
              {isListening ? "Listening..." : "Voice Search"}
            </motion.button>
          </div>
        </div>

        {/* Display added ingredients */}
        <motion.div className="mb-8 flex flex-wrap gap-4" layout>
          <AnimatePresence>
            {ingredients.map((ing, index) => (
              <motion.div
                key={ing}
                className="bg-orange-100 text-orange-800 p-3 rounded-full shadow-sm flex items-center space-x-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <span>{ing}</span>
                <motion.button
                  onClick={() => handleDeleteIngredient(ing)}
                  className="text-red-600 hover:text-red-800 transition"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={16} />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.button
          onClick={handleFindSubstitutes}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full p-4 shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Find Substitutes
        </motion.button>

        {/* Display substitutions */}
        <AnimatePresence>
          {substitutions && (
            <motion.div
              className="mt-8 p-6 bg-orange-50 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold text-orange-600 mb-4">
                Substitutes for {substitutions.name}
              </h3>
              <ul className="list-disc list-inside text-gray-800">
                {substitutions.substitutes.map((sub, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {sub}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Display error message */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              className="mt-8 p-6 bg-red-100 text-red-800 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold">No Substitutes Found</h3>
              <p className="mt-2">{errorMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default SubstituteFinder;
