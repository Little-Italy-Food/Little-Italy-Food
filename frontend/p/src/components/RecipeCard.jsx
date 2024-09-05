import React, { useState } from "react";
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
  if (!recipe) return null;
  const [flipped, setFlipped] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const mainImageUrl = `${baseURL}${recipe.mainImage}`;

  const handleHover = () => {
    setModalContent(recipe); // Set the recipe data as modal content
    setModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
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
        </div>
      </div>
    </>
  );
};

export default RecipeCard;
