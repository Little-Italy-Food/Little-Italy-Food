import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import { Star, Clock, User, Thermometer, AlertCircle } from "lucide-react";
import NumberInputModel from "../components/model/NumberInputModel";
import CuisineType from "../components/CuisineType";
import Review from "../components/ReviewAndComment";

const RecipeView = () => {
  const location = useLocation();
  const { id } = useParams();
  const [recipe, setRecipe] = useState(location.state?.recipe || null);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [numPeople, setNumPeople] = useState(1);
  const [collectionName, setCollectionName] = useState("");
  const [collections, setCollections] = useState([]);
  const [creatingNewCollection, setCreatingNewCollection] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [averageRating, setAverageRating] = useState(null);
  console.log(averageRating);

  useEffect(() => {
    const fetchRecipeData = async () => {
      // Fetch recipe data if needed
      try {
        // Assuming you have an endpoint to fetch recipe details
        const response = await axios.get(
          `http://localhost:5001/api/recipes/${id}`
        );
        setRecipe(response.data);
      } catch (error) {
        console.error("Error fetching recipe data:", error);
      }
    };

    const fetchAverageRating = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/reviews/average-rating/${id}` // Use `id` from URL params
        );
        setAverageRating(response.data.averageRating);
      } catch (error) {
        console.error("Error fetching average rating:", error);
      }
    };

    if (id) {
      fetchRecipeData();
      fetchAverageRating();
    }
  }, [id]);

  const calculateQuantity = (baseQuantity) => {
    return (baseQuantity * numPeople).toFixed(2);
  };

  const recipeUrl = window.location.href;

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5001/api/recipes/collection",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCollections(response.data || []);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    fetchCollections();
  }, []);

  const saveRecipe = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!collectionName) {
        alert("Please select or enter a collection name.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5001/api/recipes/save-recipe",
        { recipeId: recipe._id, collectionName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Recipe saved successfully:", response.data);
      alert("Recipe saved successfully!");
    } catch (error) {
      console.error("Error saving recipe:", error);
      alert("Failed to save recipe.");
    }
  };

  useEffect(() => {
    if (!recipe) {
      axios
        .get(`http://localhost:5001/api/recipes/recipes-info/${id}`)
        .then((response) => {
          setRecipe(response.data);
          const initialCheckedState = response.data.ingredients.reduce(
            (acc, ingredient) => {
              acc[ingredient.ingredientsName] = false;
              return acc;
            },
            {}
          );
          setCheckedIngredients(initialCheckedState);
        })
        .catch((error) => console.error("Error fetching recipe:", error));
    }
  }, [id, recipe]);

  const handleCheckboxChange = (ingredientName) => {
    setCheckedIngredients((prevState) => ({
      ...prevState,
      [ingredientName]: !prevState[ingredientName],
    }));
  };

  const baseURL = "http://localhost:5001";

  const downloadPDF = () => {
    const doc = new jsPDF();
    let yOffset = 20; // Start a bit lower for better margins
    const pageHeight = doc.internal.pageSize.height;

    const addPageIfNeeded = (additionalHeight) => {
      if (yOffset + additionalHeight > pageHeight - 20) {
        doc.addPage();
        yOffset = 20;
      }
    };

    // Add Title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(recipe.name, 10, yOffset);
    yOffset += 15;

    // Add Descriptions
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("Brief Description:", 10, yOffset);
    yOffset += 10;
    doc.setFontSize(14);
    doc.text(recipe.briefDescription, 10, yOffset, { maxWidth: 180 });
    yOffset += 20;

    doc.setFontSize(16);
    doc.text("Comprehensive Description:", 10, yOffset);
    yOffset += 10;
    doc.setFontSize(14);
    doc.text(recipe.comprehensiveDescription, 10, yOffset, { maxWidth: 180 });
    yOffset += 20;

    // Add Basic Info
    doc.setFontSize(16);
    doc.text("Basic Information:", 10, yOffset);
    yOffset += 10;
    doc.setFontSize(14);
    doc.text(`Servings: ${recipe.servings}`, 10, yOffset);
    yOffset += 10;
    doc.text(
      `Cooking Time: ${recipe.cookingTime.hours}h ${recipe.cookingTime.minutes}m`,
      10,
      yOffset
    );
    yOffset += 10;
    doc.text(`Difficulty: ${recipe.difficulty}`, 10, yOffset);
    yOffset += 10;
    doc.text(`Cuisine Type: ${recipe.cuisineType}`, 10, yOffset);
    yOffset += 10;
    doc.text(`Meal Type: ${recipe.mealType}`, 10, yOffset);
    yOffset += 10;
    doc.text(
      `Dietary Restrictions: ${recipe.dietaryRestrictions}`,
      10,
      yOffset
    );
    yOffset += 10;
    doc.text(
      `Meal Prep Friendly: ${recipe.mealPrepFriendly ? "Yes" : "No"}`,
      10,
      yOffset
    );
    yOffset += 10;
    doc.text(
      `Freezable Recipe: ${recipe.freezableRecipe ? "Yes" : "No"}`,
      10,
      yOffset
    );
    yOffset += 10;
    doc.text(`Approved: ${recipe.approved ? "Yes" : "No"}`, 10, yOffset);
    yOffset += 20;

    // Add Rating
    doc.setFontSize(16);
    doc.text("Rating:", 10, yOffset);
    yOffset += 10;
    doc.setFontSize(14);
    doc.text(`Rating: ${recipe.rating}`, 10, yOffset);
    yOffset += 20;

    // Add Ingredients
    doc.setFontSize(16);
    doc.text("Ingredients:", 10, yOffset);
    yOffset += 10;
    doc.setFontSize(14);
    recipe.ingredients.forEach((ingredient, index) => {
      addPageIfNeeded(10);
      doc.text(
        `${calculateQuantity(ingredient.quantity)} ${ingredient.unit} ${
          ingredient.ingredientsName
        }`,
        10,
        yOffset
      );
      yOffset += 10;
    });

    // Add Nutrition Values
    addPageIfNeeded(20);
    doc.setFontSize(16);
    doc.text("Nutrition Values:", 10, yOffset);
    yOffset += 10;
    doc.setFontSize(14);
    doc.text(`Protein: ${recipe.nutritionValues.protein}`, 10, yOffset);
    yOffset += 10;
    doc.text(`Fat: ${recipe.nutritionValues.fat}`, 10, yOffset);
    yOffset += 10;
    doc.text(`Carbs: ${recipe.nutritionValues.carbs}`, 10, yOffset);
    yOffset += 10;
    doc.text(`Calories: ${recipe.nutritionValues.calories}`, 10, yOffset);
    yOffset += 10;
    doc.text(`Vitamins: ${recipe.nutritionValues.vitamins}`, 10, yOffset);
    yOffset += 20;

    // Add Main Image
    addPageIfNeeded(60);
    doc.setFontSize(16);
    doc.text("Main Image:", 10, yOffset);
    yOffset += 10;
    doc.addImage(
      `${baseURL}/${recipe.mainImage.replace(".avif", ".png")}`,
      "PNG",
      10,
      yOffset,
      180,
      100
    );
    yOffset += 110; // Move down for sub images

    // Add Sub Images
    addPageIfNeeded(120);
    doc.setFontSize(16);
    doc.text("Sub Images:", 10, yOffset);
    yOffset += 10;
    recipe.subImages.forEach((img, index) => {
      addPageIfNeeded(110);
      doc.addImage(
        `${baseURL}/${img.replace(".avif", ".png")}`,
        "PNG",
        10,
        yOffset,
        180,
        100
      );
      yOffset += 110; // Move down for the next image
    });

    // Add Video Link
    addPageIfNeeded(20);
    doc.setFontSize(16);
    doc.text("Video:", 10, yOffset);
    yOffset += 10;
    doc.setFontSize(14);
    doc.text(`${baseURL}/${recipe.video}`, 10, yOffset);

    // Save the PDF
    doc.save(`${recipe.name}.pdf`);
  };

  const shareOnSocialMedia = (platform) => {
    let url;
    switch (platform) {
      case "whatsapp":
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          recipeUrl
        )}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          recipeUrl
        )}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          recipeUrl
        )}`;
        break;
      default:
        break;
    }
    window.open(url, "_blank");
  };

  const copyLink = () => {
    navigator.clipboard
      .writeText(recipeUrl)
      .then(() => alert("Link copied to clipboard"))
      .catch((err) => console.error("Failed to copy: ", err));
  };

  if (!recipe) {
    return <div>Loading recipe data...</div>;
  }

  const speakText = (text) => {
    console.log("Button clicked, preparing to speak the text.");

    if ("speechSynthesis" in window) {
      console.log("speechSynthesis is supported in this browser.");

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Create the speech utterance
      const utterance = new SpeechSynthesisUtterance(text);
      console.log("Speech utterance created with text:", text);

      // Set some properties for the speech (optional)
      utterance.rate = 1; // Normal speed
      utterance.pitch = 1; // Normal pitch
      utterance.volume = 1; // Full volume

      // Log the properties being applied
      console.log(
        `Speaking with rate: ${utterance.rate}, pitch: ${utterance.pitch}, volume: ${utterance.volume}`
      );

      // Speak the text
      window.speechSynthesis.speak(utterance);
      console.log("Speech synthesis started.");
    } else {
      console.log("Sorry, speechSynthesis is not supported in this browser.");
      alert("Sorry, your browser does not support text-to-speech.");
    }
  };

  return (
    <div className="lg:px-32 mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-1">
      <div className="relative h-96">
        <img
          className="w-full h-full rounded-xl object-cover"
          src={`http://localhost:5001/${recipe.mainImage}`}
          alt={recipe.name}
        />
        <div className="absolute inset-0 rounded-xl bg-black bg-opacity-50 flex items-end">
          <h1 className="text-4xl font-bold text-white p-6">{recipe.name}</h1>
          <button
            onClick={() => setModalOpen(true)}
            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="50"
              height="50"
              viewBox="0 0 50 50"
            >
              <path d="M 12.8125 2 C 12.335938 2.089844 11.992188 2.511719 12 3 L 12 47 C 11.996094 47.359375 12.1875 47.691406 12.496094 47.871094 C 12.804688 48.054688 13.1875 48.054688 13.5 47.875 L 25 41.15625 L 36.5 47.875 C 36.8125 48.054688 37.195313 48.054688 37.503906 47.871094 C 37.8125 47.691406 38.003906 47.359375 38 47 L 38 3 C 38 2.449219 37.550781 2 37 2 L 13 2 C 12.96875 2 12.9375 2 12.90625 2 C 12.875 2 12.84375 2 12.8125 2 Z M 14 4 L 36 4 L 36 45.25 L 25.5 39.125 C 25.191406 38.945313 24.808594 38.945313 24.5 39.125 L 14 45.25 Z"></path>
            </svg>{" "}
          </button>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md transition-transform transform scale-95 hover:scale-100">
            <h2 className="text-xl font-semibold mb-4">Save Recipe</h2>
            <div className="mt-2">
              <select
                value={creatingNewCollection ? "custom" : collectionName}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "custom") {
                    setCreatingNewCollection(true);
                    setCollectionName("");
                  } else {
                    setCreatingNewCollection(false);
                    setCollectionName(value);
                  }
                }}
                className="px-4 py-2 text-sm font-medium bg-gray-100 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              >
                {!creatingNewCollection && (
                  <>
                    <option value="">Select a Collection</option>
                    {collections.map((collection) => (
                      <option
                        key={collection._id}
                        value={collection.collectionName}
                      >
                        {collection.collectionName}
                      </option>
                    ))}
                  </>
                )}
                <option value="custom">Create New Collection</option>
              </select>
              {creatingNewCollection && (
                <input
                  type="text"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  placeholder="Enter new collection name"
                  className="mt-4 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                />
              )}
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => {
                    saveRecipe();
                    setModalOpen(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                >
                  Save Recipe
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            recipe.cuisineType,
            recipe.mealType,
            ...recipe.dietaryRestrictions,
          ].map((item, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
            >
              {item}
            </span>
          ))}
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1" />
            <span>
              {averageRating ? averageRating.toFixed(1) : "Loading..."}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>
              {recipe.cookingTime.hours}h {recipe.cookingTime.minutes}m
            </span>
          </div>
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span>{recipe.servings} servings</span>
          </div>
          <div className="flex items-center">
            <Thermometer className="w-4 h-4 mr-1" />
            <span>{recipe.difficulty}</span>
          </div>
        </div>
        <div className="mb-6 bg-gray-100 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Description</h2>
            <button
              onClick={() =>
                speakText(
                  `${recipe.comprehensiveDescription} ${recipe.briefDescription}`
                )
              }
              className="bg-blue-500 text-white p-2 rounded"
            >
              Read Aloud
            </button>
          </div>
          <p className="text-gray-700 mb-4">
            {recipe.comprehensiveDescription}
          </p>
          <p className="text-gray-700">{recipe.briefDescription}</p>
        </div>
        <NumberInputModel
          label="Number of People"
          value={numPeople}
          onChange={(e) => setNumPeople(e.target.value)}
        />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={
                      checkedIngredients[ingredient.ingredientsName] || false
                    }
                    onChange={() =>
                      handleCheckboxChange(ingredient.ingredientsName)
                    }
                    className="form-checkbox"
                  />
                  <span>
                    {calculateQuantity(ingredient.quantity)} {ingredient.unit}{" "}
                    {ingredient.ingredientsName}
                    {ingredient.alternative && (
                      <span className="text-sm text-gray-500">
                        {" "}
                        (Alt: {ingredient.alternative})
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Nutrition Values</h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Calories:</strong> {recipe.nutritionValues.calories}
              </p>
              <p>
                <strong>Carbs:</strong> {recipe.nutritionValues.carbs}
              </p>
              <p>
                <strong>Fat:</strong> {recipe.nutritionValues.fat}
              </p>
              <p>
                <strong>Protein:</strong> {recipe.nutritionValues.protein}
              </p>
              <p>
                <strong>Vitamins:</strong> {recipe.nutritionValues.vitamins}
              </p>
            </div>
          </div>
        </div>
        {recipe.subImages.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recipe.subImages.map((image, index) => (
                <img
                  key={index}
                  className="w-full h-40 object-cover rounded-lg"
                  src={`http://localhost:5001/${image}`}
                  alt={`Sub Image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
        <hr className="my-6 border-t border-gray-300" />
        {recipe.video && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Video Tutorial</h2>
            <video className="w-full rounded-lg" controls>
              <source
                src={`http://localhost:5001/${recipe.video}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        <hr className="my-6 border-t border-gray-300" />
        <div className="flex justify-between text-sm text-gray-500">
          <p>Created: {new Date(recipe.createdAt).toLocaleDateString()}</p>
          <p>Updated: {new Date(recipe.updatedAt).toLocaleDateString()}</p>
        </div>
        {(recipe.mealPrepFriendly || recipe.freezableRecipe) && (
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span>
              {recipe.mealPrepFriendly && "Meal Prep Friendly"}
              {recipe.mealPrepFriendly && recipe.freezableRecipe && " • "}
              {recipe.freezableRecipe && "Freezable Recipe"}
            </span>
          </div>
        )}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => shareOnSocialMedia("whatsapp")}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30"
              height="30"
              viewBox="0 0 48 48"
            >
              <linearGradient
                id="k87TA_gnBJ8uBlK4qfs8ia_AltfLkFSP7XN_gr1"
                x1="6.718"
                x2="35.097"
                y1="12.801"
                y2="41.18"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#dfe9f2"></stop>
                <stop offset=".391" stopColor="#d6e0e9"></stop>
                <stop offset="1" stopColor="#bfc8d1"></stop>
              </linearGradient>
              <path
                fill="url(#k87TA_gnBJ8uBlK4qfs8ia_AltfLkFSP7XN_gr1)"
                d="M37.848,9.86C34.073,6.083,29.052,4.002,23.709,4C12.693,4,3.727,12.962,3.722,23.979	c-0.001,3.367,0.849,6.685,2.461,9.622L3.598,43.04c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297	c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98	C43.698,18.656,41.621,13.636,37.848,9.86z"
              ></path>
              <linearGradient
                id="k87TA_gnBJ8uBlK4qfs8ib_AltfLkFSP7XN_gr2"
                x1="15.389"
                x2="28.863"
                y1="10.726"
                y2="39.265"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#2ecc75"></stop>
                <stop offset="1" stopColor="#0b964a"></stop>
              </linearGradient>
              <path
                fill="url(#k87TA_gnBJ8uBlK4qfs8ib_AltfLkFSP7XN_gr2)"
                d="M34.871,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774	c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006	c8.698,0,15.777-7.077,15.78-15.776C39.49,19.778,37.851,15.814,34.871,12.832z"
              ></path>
              <path
                d="M28.893,33.879c-0.995,0-2.354-0.254-5.087-1.331c-3.06-1.208-6.066-3.83-8.464-7.384l-0.077-0.113	c-0.642-0.857-2.132-3.107-2.132-5.5c0-2.58,1.288-3.953,1.838-4.54l0.085-0.091C15.815,14.089,16.709,14,17.058,14	c0.369,0.004,0.682,0,0.953,0.012c0.654,0.026,1.399,0.215,1.936,1.409l0,0c0.25,0.558,0.676,1.605,1.009,2.426	c0.213,0.527,0.386,0.955,0.439,1.069c0.294,0.586,0.308,1.167,0.036,1.714l-0.065,0.133c-0.128,0.262-0.261,0.533-0.544,0.863	l-0.235,0.282c-0.162,0.197-0.325,0.393-0.47,0.545c0.389,0.641,1.206,1.856,2.331,2.86c1.394,1.241,2.588,1.76,3.229,2.039	c0.127,0.055,0.233,0.102,0.317,0.142c0.405-0.47,1.072-1.271,1.302-1.614c0.77-1.156,1.877-0.755,2.24-0.622	c0.569,0.206,3.323,1.576,3.35,1.589l0.255,0.125c0.419,0.203,0.813,0.394,1.062,0.808c0.395,0.661,0.176,2.073-0.193,3.105	c-0.534,1.503-2.828,2.805-4.054,2.915l-0.226,0.024C29.465,33.855,29.196,33.879,28.893,33.879z M17.216,16	c-0.14,0-0.385-0.058-0.686,0.27l-0.101,0.109c-0.453,0.483-1.297,1.383-1.297,3.172c0,1.843,1.326,3.757,1.732,4.3	c0.027,0.036,0.071,0.101,0.135,0.194c2.175,3.223,4.853,5.582,7.541,6.642c3.384,1.335,4.253,1.234,4.956,1.151l0.278-0.03	c0.609-0.055,2.122-0.951,2.351-1.594c0.209-0.585,0.276-1.087,0.287-1.374c-0.044-0.021-0.092-0.043-0.143-0.067l-0.283-0.139	c-0.637-0.32-2.779-1.366-3.131-1.495c-0.442,0.608-1.262,1.565-1.479,1.814c-0.407,0.467-1.127,0.909-2.229,0.354	c-0.066-0.033-0.156-0.071-0.268-0.12c-0.691-0.301-2.13-0.926-3.763-2.38c-1.469-1.311-2.474-2.904-2.838-3.529	c-0.445-0.761-0.322-1.495,0.366-2.18c0.12-0.12,0.257-0.291,0.397-0.46l0.262-0.314c0.118-0.137,0.161-0.226,0.267-0.441	l0.035-0.071c-0.092-0.204-0.278-0.659-0.502-1.213c-0.323-0.797-0.736-1.815-0.979-2.357v0c-0.065-0.144-0.114-0.215-0.138-0.245	c0.005,0.015-0.029,0.016-0.058,0.014C17.706,16,17.463,16,17.216,16z M32.407,28.615L32.407,28.615L32.407,28.615z M19.642,19.736	L19.642,19.736L19.642,19.736z"
                opacity=".05"
              ></path>
              <path
                d="M28.889,33.384c-0.846,0-2.155-0.22-4.899-1.302c-2.967-1.17-5.891-3.727-8.233-7.198l-0.087-0.128	c-0.616-0.822-2.037-2.962-2.037-5.206c0-2.382,1.193-3.654,1.703-4.198l0.089-0.096c0.625-0.683,1.351-0.756,1.634-0.756	c0.377,0.003,0.667,0,0.931,0.012c0.492,0.02,1.057,0.124,1.502,1.114l0,0c0.249,0.554,0.671,1.594,1.001,2.409	c0.225,0.555,0.405,1.002,0.452,1.097c0.082,0.165,0.338,0.674,0.039,1.275l-0.067,0.136c-0.125,0.255-0.233,0.476-0.475,0.758	L20.2,21.59c-0.173,0.21-0.346,0.419-0.496,0.569c-0.216,0.215-0.216,0.215-0.13,0.362c0.328,0.563,1.232,1.998,2.541,3.165	c1.453,1.295,2.696,1.834,3.363,2.124c0.144,0.062,0.259,0.113,0.344,0.156c0.293,0.146,0.323,0.116,0.427-0.002	c0.288-0.328,1.168-1.364,1.463-1.807c0.554-0.83,1.269-0.57,1.654-0.431c0.506,0.184,3.039,1.437,3.296,1.566l0.262,0.128	c0.38,0.184,0.68,0.329,0.852,0.614c0.254,0.426,0.149,1.603-0.235,2.681c-0.488,1.371-2.646,2.497-3.628,2.585l-0.239,0.026	C29.441,33.354,29.196,33.384,28.889,33.384z M17.201,15.5c-0.026,0-0.052,0-0.078,0c-0.183,0-0.595,0.031-0.962,0.432l-0.097,0.104	c-0.465,0.496-1.432,1.528-1.432,3.514c0,1.943,1.281,3.864,1.832,4.6c0.025,0.033,0.064,0.09,0.121,0.174	c2.231,3.306,4.991,5.73,7.772,6.828c3.505,1.382,4.445,1.271,5.197,1.183l0.267-0.029c0.693-0.062,2.451-1.013,2.776-1.925	c0.333-0.932,0.347-1.71,0.296-1.877c0.007,0.006-0.232-0.098-0.405-0.182l-0.276-0.136c-0.623-0.313-2.806-1.381-3.188-1.52	c-0.36-0.13-0.361-0.133-0.48,0.046c-0.349,0.521-1.32,1.657-1.542,1.91c-0.642,0.735-1.384,0.359-1.629,0.236	c-0.072-0.036-0.171-0.078-0.293-0.131c-0.668-0.291-2.057-0.895-3.63-2.296c-1.416-1.262-2.387-2.803-2.739-3.407	c-0.476-0.814,0.059-1.347,0.287-1.574c0.13-0.13,0.28-0.313,0.431-0.497l0.255-0.306c0.159-0.186,0.226-0.322,0.336-0.547	l0.07-0.143c0.049-0.098,0.058-0.189-0.04-0.383c-0.052-0.104-0.245-0.578-0.483-1.167c-0.326-0.803-0.741-1.829-0.987-2.374l0,0	c-0.229-0.509-0.363-0.515-0.632-0.525C17.717,15.5,17.461,15.5,17.201,15.5z"
                opacity=".07"
              ></path>
              <path
                fill="#fff"
                fillRule="evenodd"
                d="M19.035,15.831c-0.355-0.79-0.729-0.806-1.068-0.82	C17.69,14.999,17.374,15,17.058,15s-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956s1.7,4.59,1.937,4.906	c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255	c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543	c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119	c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968	c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831	C20.379,19.115,19.457,16.769,19.035,15.831z"
                clipRule="evenodd"
              ></path>
            </svg>
            Share on WhatsApp
          </button>

          <button
            onClick={() => shareOnSocialMedia("twitter")}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30"
              height="30"
              viewBox="0 0 50 50"
            >
              <path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z"></path>
            </svg>
            Share on Twitter
          </button>

          <button
            onClick={() => shareOnSocialMedia("facebook")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30"
              height="30"
              viewBox="0 0 48 48"
            >
              <linearGradient
                id="Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1"
                x1="9.993"
                x2="40.615"
                y1="9.993"
                y2="40.615"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#2aa4f4"></stop>
                <stop offset="1" stopColor="#007ad9"></stop>
              </linearGradient>
              <path
                fill="url(#Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1)"
                d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"
              ></path>
              <path
                fill="#fff"
                d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"
              ></path>
            </svg>
            Share on Facebook
          </button>

          <button
            onClick={copyLink}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            <img
              width="30"
              height="30"
              src="https://img.icons8.com/fluency-systems-filled/50/copy-link.png"
              alt="copy-link"
            />
            Copy Link
          </button>

          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Download PDF
          </button>
        </div>
        <CuisineType cuisineType={recipe.cuisineType} />
        <Review id={recipe._id} />
      </div>
    </div>
  );
};

export default RecipeView;
