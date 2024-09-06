import React, { useEffect, useState } from "react";
import {
  ChevronRight,
  X,
  Clock,
  Users,
  BarChart2,
  Leaf,
  Book,
  Calendar,
  PlayCircle,
  Image as ImageIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SavedRecipe = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [recipeDetails, setRecipeDetails] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5001/api/recipes/getAll-saved",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setSavedRecipes(data);

        const recipeIds = data.flatMap((collection) => collection.recipes);
        const uniqueRecipeIds = [...new Set(recipeIds)];

        for (const id of uniqueRecipeIds) {
          const recipeResponse = await fetch(
            `http://localhost:5001/api/recipes/recipes-info/${id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (recipeResponse.ok) {
            const recipeData = await recipeResponse.json();
            setRecipeDetails((prevDetails) => ({
              ...prevDetails,
              [id]: recipeData,
            }));
          } else {
            console.error(`Error fetching details for recipe ID ${id}`);
          }
        }
      } catch (error) {
        console.error("Error fetching saved recipes:", error);
      }
    };

    fetchSavedRecipes();
  }, []);

  const toggleCollection = (collection) => {
    setSelectedCollection(collection);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="font-sans py-12 px-4 mx-auto max-w-full bg-white">
      <motion.div
        className="relative py-8 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="text-5xl md:text-6xl font-extrabold text-gray-900 text-center mb-4 relative"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="relative z-10">Your Culinary Collection</span>
          <motion.span
            className="absolute inset-x-0 bottom-2 h-3 bg-orange-300 z-0"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </motion.h2>
        <motion.div
          className="flex justify-center space-x-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {["🍳", "🥗", "🍰"].map((emoji, index) => (
            <motion.span
              key={index}
              className="text-3xl"
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
      {savedRecipes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center p-12 bg-white rounded-lg shadow-lg border-2 border-orange-300"
        >
          <Book size={64} className="mx-auto mb-4 text-orange-500" />
          <p className="text-2xl text-gray-600">
            Your recipe book is empty. Time to start cooking!
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {savedRecipes.map((collection, index) => (
            <motion.div
              key={collection._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 border-2 border-orange-300"
            >
              <div
                className="p-6 cursor-pointer"
                onClick={() => toggleCollection(collection)}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {collection.collectionName}
                  </h3>
                  <ChevronRight className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2 text-orange-400" />
                  <p>
                    Created on{" "}
                    {new Date(collection.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Book className="w-4 h-4 mr-2 text-orange-400" />
                  <p>{collection.recipes.length} recipes</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {modalOpen && selectedCollection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold text-gray-800">
                  {selectedCollection.collectionName}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-orange-500 focus:outline-none transition-colors duration-300"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8">
                {selectedCollection.recipes.length === 0 ? (
                  <div className="text-center p-8 bg-orange-50 rounded-lg">
                    <Book size={48} className="mx-auto mb-4 text-orange-500" />
                    <p className="text-xl text-gray-600">
                      This collection is hungry for recipes!
                    </p>
                  </div>
                ) : (
                  selectedCollection.recipes.map((recipeId) => (
                    <motion.div
                      key={recipeId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="border-t border-orange-200 pt-8"
                    >
                      {recipeDetails[recipeId] ? (
                        <div>
                          <img
                            src={`http://localhost:5001/${recipeDetails[recipeId].mainImage}`}
                            alt={recipeDetails[recipeId].name}
                            className="w-full h-64 object-cover rounded-lg mb-6 shadow-md"
                          />
                          <h4 className="text-2xl font-semibold text-gray-800 mb-3">
                            {recipeDetails[recipeId].name}
                          </h4>
                          <p className="text-gray-600 mb-4 text-lg">
                            {recipeDetails[recipeId].briefDescription}
                          </p>
                          <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6">
                            <div className="flex items-center">
                              <Clock className="w-5 h-5 mr-2 text-orange-500" />
                              <span>
                                {recipeDetails[recipeId].cookingTime.hours}h{" "}
                                {recipeDetails[recipeId].cookingTime.minutes}m
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Users className="w-5 h-5 mr-2 text-orange-500" />
                              <span>
                                {recipeDetails[recipeId].servings} servings
                              </span>
                            </div>
                            <div className="flex items-center">
                              <BarChart2 className="w-5 h-5 mr-2 text-orange-500" />
                              <span>{recipeDetails[recipeId].difficulty}</span>
                            </div>
                            <div className="flex items-center">
                              <Leaf className="w-5 h-5 mr-2 text-orange-500" />
                              <span>
                                {recipeDetails[recipeId].dietaryRestrictions}
                              </span>
                            </div>
                          </div>
                          {recipeDetails[recipeId].subImages.length > 0 && (
                            <div className="mb-6">
                              <h5 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                <ImageIcon className="w-5 h-5 mr-2 text-orange-500" />
                                Additional Images
                              </h5>
                              <div className="flex gap-3 overflow-x-auto pb-2">
                                {recipeDetails[recipeId].subImages.map(
                                  (subImage, index) => (
                                    <img
                                      key={index}
                                      src={`http://localhost:5001/${subImage}`}
                                      alt={`${recipeDetails[recipeId].name} ${
                                        index + 1
                                      }`}
                                      className="w-24 h-24 object-cover rounded-md flex-shrink-0 shadow-sm"
                                    />
                                  )
                                )}
                              </div>
                            </div>
                          )}
                          {recipeDetails[recipeId].video && (
                            <div className="mb-6">
                              <h5 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                <PlayCircle className="w-5 h-5 mr-2 text-orange-500" />
                                Recipe Video
                              </h5>
                              <video
                                controls
                                src={`http://localhost:5001/${recipeDetails[recipeId].video}`}
                                className="w-full h-auto rounded-lg shadow-md"
                              >
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          )}
                          <Link
                            to={`/recipe1/${recipeDetails[recipeId]._id}`}
                            className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors duration-300 shadow-md"
                          >
                            Open The Recipe
                            <ChevronRight size={20} className="ml-2" />
                          </Link>
                        </div>
                      ) : (
                        <div className="animate-pulse space-y-4">
                          <div className="h-64 bg-orange-200 rounded-lg"></div>
                          <div className="h-6 bg-orange-200 rounded w-3/4"></div>
                          <div className="h-4 bg-orange-200 rounded"></div>
                          <div className="h-4 bg-orange-200 rounded w-5/6"></div>
                          <div className="flex space-x-4">
                            <div className="h-4 bg-orange-200 rounded w-1/4"></div>
                            <div className="h-4 bg-orange-200 rounded w-1/4"></div>
                            <div className="h-4 bg-orange-200 rounded w-1/4"></div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SavedRecipe;
