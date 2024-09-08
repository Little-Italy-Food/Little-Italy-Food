import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import m1 from "../assets/m1-removebg-preview.png";
import m2 from "../assets/m2-removebg-preview.png";
import m3 from "../assets/m3-removebg-preview.png";

const baseURL = "http://localhost:5001/";

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
  const [hovering, setHovering] = useState(false);

  const handleMouseEnter = () => setHovering(true);
  const handleMouseLeave = () => setHovering(false);

  const mainImageUrl = `${baseURL}${recipe.mainImage}`;

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

  const handleHover = () => {
    setModalContent(recipe);
    setModalOpen(true);
    setHovering(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

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

  return (
    <>
      <div
        className="relative w-full h-96 bg-gray-200 flex items-center justify-center text-black rounded-lg overflow-hidden"
        style={{
          perspective: "2000px",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transition: "transform 0.5s",
            transformOrigin: "left",
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(-80deg)" : "rotateY(0deg)",
          }}
          onClick={() => setFlipped(!flipped)}
        >
          <img
            src={mainImageUrl}
            alt={recipe.name}
            className="w-full h-full object-cover rounded-lg"
          />
          <div
            className={`absolute inset-0 bg-gray-800 bg-opacity-75 flex flex-col items-center justify-center transition-opacity duration-300 ${
              hovering ? "opacity-100" : "opacity-0"
            }`}
            style={{ zIndex: 10 }}
          >
            <h2 className="text-xl font-semibold text-white mb-2">
              {recipe.name}
            </h2>
            <p className="text-md text-white mb-4 text-center p-3">
              {recipe.briefDescription}
            </p>
            <p className="text-md text-white">Click to flip</p>
          </div>
        </div>
        <div className="text-center mt-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {recipe.name}
          </h2>
          <p className="text-md text-gray-700 mb-4">
            {recipe.briefDescription}
          </p>
          <Link
            to={{
              pathname: `/recipe1/${recipe._id}`,
              state: { recipe },
            }}
          >
            <button className="px-5 py-3 text-md font-semibold text-white bg-[#FF5733] rounded-lg shadow-md hover:opacity-70 transition-colors duration-300">
              View Recipe
            </button>
          </Link>
          <div className="mt-4 flex flex-col items-center">
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
              className="px-4 py-2 text-md font-medium bg-gray-200 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF5733] transition-colors duration-300"
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
                className="mt-3 px-4 py-2 text-md font-medium border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF5733] transition-colors duration-300"
              />
            )}
            <button
              onClick={saveRecipe}
              className="px-5 py-3 text-md font-semibold text-white bg-[#FF5733] rounded-lg shadow-md hover:opacity-70 transition-colors duration-300 mt-4"
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
