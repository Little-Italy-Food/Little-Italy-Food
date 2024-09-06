import React, { useState } from "react";
import axios from "axios";

function SubstituteFinder() {
  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState("");
  const [substitutions, setSubstitutions] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

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
      const apiKey = "c280ca0a9b9a4b69905d8dbee2ad9524"; // Replace with your actual Spoonacular API key

      // Fetch substitutions for the first ingredient (you can expand this to all ingredients)
      const response = await axios.get(
        `https://api.spoonacular.com/food/ingredients/substitutes`,
        {
          params: {
            apiKey: apiKey,
            ingredientName: ingredients[0], // Fetch substitute for the first ingredient in the list
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
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-xl mx-auto bg-white shadow p-5">
        <h1 className="text-2xl font-bold mb-4">
          Find Substitutes for Ingredients
        </h1>

        <div className="flex mb-4">
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
            onClick={handleVoiceSearch}
            className={`bg-purple-500 text-white p-2 ml-2 ${
              isListening ? "opacity-50" : ""
            }`}
            disabled={isListening}
          >
            {isListening ? "Listening..." : "Voice Search"}
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
          onClick={handleFindSubstitutes}
          className="mt-4 bg-green-500 text-white p-2 w-full"
        >
          Find Substitutes
        </button>

        {/* Display Substitutions */}
        {substitutions && (
          <div className="mt-4 bg-white p-4 shadow">
            <h3 className="text-xl font-bold">
              Substitutes for {substitutions.name}
            </h3>
            <ul className="list-disc ml-5">
              {substitutions.substitutes.map((sub, index) => (
                <li key={index}>{sub}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Display Error Message */}
        {errorMessage && (
          <div className="mt-4 bg-red-100 text-red-700 p-4 shadow">
            <h3 className="text-xl font-bold">No Substitutes Found</h3>
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubstituteFinder;
