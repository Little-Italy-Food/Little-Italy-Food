import React, { useState, useEffect } from "react";
import axios from "axios";

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
    }, 1500);

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
      <div className="relative w-full h-96 overflow-hidden rounded-b-1xl shadow-lg">
        <img
          src={images[currentImageIndex]}
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-6xl font-extrabold text-white text-center drop-shadow-md">
            Find Ingredient Substitutes
          </h1>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto bg-white shadow-xl rounded-lg p-10 mt-8 mb-20">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Easily Find Substitutions for Your Ingredients
        </h1>

        <div className="flex flex-col md:flex-row mb-8 items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full md:w-2/3 border border-gray-300 rounded-full p-4 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4 md:mb-0 md:mr-4"
            placeholder="Enter an ingredient"
          />
          <div className="flex space-x-4">
            <button
              onClick={handleAddIngredient}
              className="bg-orange-500 text-white rounded-full p-4 shadow-md hover:bg-orange-600 transition-all duration-300"
            >
              Add Ingredient
            </button>
            <button
              onClick={handleVoiceSearch}
              className={`bg-orange-400 text-white rounded-full p-4 shadow-md hover:bg-orange-500 transition-all duration-300 ${
                isListening ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isListening}
            >
              {isListening ? "Listening..." : "Voice Search"}
            </button>
          </div>
        </div>

        {/* Display added ingredients */}
        {ingredients.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-4">
            {ingredients.map((ing, index) => (
              <div
                key={index}
                className="bg-orange-100 text-orange-800 p-3 rounded-full shadow-sm flex items-center space-x-3"
              >
                <span>{ing}</span>
                <button
                  onClick={() => handleDeleteIngredient(ing)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleFindSubstitutes}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full p-4 shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
        >
          Find Substitutes
        </button>

        {/* Display substitutions */}
        {substitutions && (
          <div className="mt-8 p-6 bg-orange-50 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-orange-600 mb-4">
              Substitutes for {substitutions.name}
            </h3>
            <ul className="list-disc list-inside text-gray-800">
              {substitutions.substitutes.map((sub, index) => (
                <li key={index}>{sub}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Display error message */}
        {errorMessage && (
          <div className="mt-8 p-6 bg-red-100 text-red-800 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold">No Substitutes Found</h3>
            <p className="mt-2">{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubstituteFinder;
