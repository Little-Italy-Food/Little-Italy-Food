import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import { Link } from "react-router-dom";
import m1 from "../assets/m1-removebg-preview.png";
import m2 from "../assets/m2-removebg-preview.png";
import m3 from "../assets/m3-removebg-preview.png";

const baseURL = "http://localhost:5001/";

// Define Slogan and Medal components
const Slogan = ({ onHover }) => (
  <div className="medal text-yellow-800 rounded-md" onMouseEnter={onHover}>
    <img src={m1} alt="Medal" className="w-24 h-24" />
  </div>
);

const Medal = ({ onHover }) => (
  <div className="medal text-yellow-800 rounded-md" onMouseEnter={onHover}>
    <img src={m2} alt="Medal" className="w-24 h-24" />
  </div>
);

const SpecialMedal = ({ onHover }) => (
  <div className="medal text-yellow-800 rounded-md" onMouseEnter={onHover}>
    <img src={m3} alt="Medal" className="w-24 h-24" />
  </div>
);

const RecipeCard = ({ recipe }) => {
  const [flipped, setFlipped] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [collections, setCollections] = useState([]);
  const [creatingNewCollection, setCreatingNewCollection] = useState(false);

  const mainImageUrl = `${baseURL}${recipe.mainImage}`;

  useEffect(() => {
    // Fetch existing collections when the component mounts
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
        setCollections(response.data || []); // Set collections to fetched data
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    fetchCollections();
  }, []);

  const handleHover = () => {
    setModalContent(recipe);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  // Function to save the recipe to the backend
  const saveRecipe = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from local storage

      // Validate collection name
      if (!collectionName) {
        alert("Please select or enter a collection name.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5001/api/recipes/save-recipe",
        { recipeId: recipe._id, collectionName }, // Send recipe ID and collection name
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token in the header
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

  return (
    <>
      <div
        className="relative w-64 h-80 bg-whitesmoke flex items-center justify-center text-black rounded-lg"
        style={{
          boxShadow: "1px 1px 14px 1px rgba(255,87,51,1)",
          perspective: "2000px",
        }}
        onMouseEnter={handleHover}
        onMouseLeave={() => setModalOpen(false)}
      >
        <div
          className="absolute inset-0 bg-lightgray rounded-lg cursor-pointer flex flex-col items-center justify-center"
          style={{
            boxShadow: "1px 1px 14px 1px rgba(255,87,51,1)",
            transition: "transform 0.5s",
            transformOrigin: "left",
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(-80deg)" : "rotateY(0deg)",
          }}
          onClick={() => setFlipped(!flipped)}
        >
          <div className="relative z-10 w-full h-full">
            <img
              src={mainImageUrl}
              alt={recipe.name}
              className="w-full h-full object-cover rounded-t-lg"
            />
          </div>

          <div className="absolute top-2 left-2 z-50">
            {recipe.freezableRecipe && recipe.mealPrepFriendly ? (
              <Medal />
            ) : recipe.freezableRecipe ? (
              <SpecialMedal />
            ) : recipe.mealPrepFriendly ? (
              <Slogan />
            ) : null}
          </div>

          <div className="absolute inset-0 bg-white rounded-lg flex items-center justify-center p-4"></div>
        </div>
        <div className="text-center mt-4">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            {recipe.name}
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            {recipe.briefDescription}
          </p>
          <Link
            to={{
              pathname: `/recipe/${recipe._id}`,
              state: { recipe },
            }}
          >
            <button className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg shadow hover:bg-blue-700 transition-colors duration-300">
              View Recipe
            </button>
          </Link>
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
              className="px-4 py-2 text-sm font-medium bg-gray-200 rounded-lg shadow"
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
                className="mt-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg shadow"
              />
            )}
            <button
              onClick={saveRecipe}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg shadow hover:bg-blue-700 transition-colors duration-300 mt-2"
            >
              Save Recipe
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipeCard;
