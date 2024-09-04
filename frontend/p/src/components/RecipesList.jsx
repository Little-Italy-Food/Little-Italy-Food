import React, { useState } from "react";
import axios from "axios";
import EditRecipeModal from "./EditRecipeModal ";
import ConfirmDialog from "./ConfirmDialog";

const RecipesList = ({ items, setItems }) => {
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  const handleEditClick = (item) => {
    setEditingRecipe(item);
  };

  const handleSaveEdit = async (updatedRecipe) => {
    const token = localStorage.getItem("token");

    // Create a new FormData instance
    const formData = new FormData();
    formData.append("name", updatedRecipe.name);
    formData.append("servings", updatedRecipe.servings);
    formData.append("briefDescription", updatedRecipe.briefDescription);
    formData.append(
      "comprehensiveDescription",
      updatedRecipe.comprehensiveDescription
    );
    formData.append("cookingTime", JSON.stringify(updatedRecipe.cookingTime));
    formData.append("cuisineType", updatedRecipe.cuisineType);
    formData.append("mealType", updatedRecipe.mealType);
    formData.append("difficulty", updatedRecipe.difficulty);
    formData.append("mealPrepFriendly", updatedRecipe.mealPrepFriendly);
    formData.append("freezableRecipe", updatedRecipe.freezableRecipe);
    formData.append("dietaryRestrictions", updatedRecipe.dietaryRestrictions);
    formData.append("ingredients", JSON.stringify(updatedRecipe.ingredients));
    formData.append(
      "nutritionValues",
      JSON.stringify(updatedRecipe.nutritionValues)
    );

    if (updatedRecipe.mainImage) {
      formData.append("mainImage", updatedRecipe.mainImage);
    }
    if (updatedRecipe.subImages) {
      updatedRecipe.subImages.forEach((file) => {
        formData.append("subImages", file);
      });
    }
    if (updatedRecipe.video) {
      formData.append("video", updatedRecipe.video);
    }

    try {
      const response = await axios.put(
        `http://localhost:5001/api/recipes/recipes/${updatedRecipe._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedData = response.data;

      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === updatedData.recipe._id ? updatedData.recipe : item
        )
      );

      setEditingRecipe(null);
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  const handleDelete = async () => {
    console.log("Deleting recipe with ID:", recipeToDelete); // Debugging line
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `http://localhost:5001/api/recipes/recipes/${recipeToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove deleted recipe from the local state
      setItems((prevItems) =>
        prevItems.filter((item) => item._id !== recipeToDelete)
      );
      setDialogOpen(false);
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const handleClickDelete = (id) => {
    console.log("Recipe ID to delete:", id); // Debugging line
    setRecipeToDelete(id);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleClose = () => {
    setEditingRecipe(null);
  };

  return (
    <div>
      {editingRecipe && (
        <EditRecipeModal
          editingRecipe={editingRecipe}
          setEditingRecipe={setEditingRecipe}
          handleSaveEdit={handleSaveEdit}
          onClose={handleClose}
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4 px-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl overflow-hidden shadow-lg transform hover:-translate-y-2 hover:shadow-2xl transition duration-300 ease-in-out"
            style={{ maxWidth: "560px" }}
          >
            {item.mainImage && (
              <div className="relative h-56">
                <img
                  src={`http://localhost:5001/${item.mainImage}`}
                  alt={item.name || "Recipe Image"}
                  className="w-full h-full object-cover rounded-t-xl"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h3 className="text-white text-xl font-bold">{item.name}</h3>
                </div>
              </div>
            )}
            <div className="p-6">
              <p className="text-gray-600 mb-4">{item.briefDescription}</p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold">Cooking Time:</span>{" "}
                  {item?.cookingTime?.hours || "0"}h{" "}
                  {item?.cookingTime?.minutes || "0"}m
                </div>
                <div>
                  <span className="font-semibold">Servings:</span>{" "}
                  {item.servings}
                </div>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Ingredients:</h4>
                {Array.isArray(item.ingredients) &&
                item.ingredients.length > 0 ? (
                  <ul className="list-disc pl-5 text-gray-700">
                    {item.ingredients.map((ingredient, index) => (
                      <li key={index}>
                        {ingredient.ingredientsName} {ingredient.quantity}{" "}
                        {ingredient.unit} of {ingredient.type}{" "}
                        {ingredient.alternative &&
                          `(Alternative: ${ingredient.alternative})`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No ingredients listed.</p>
                )}
              </div>
              <p className="text-gray-600 mb-4">
                {item.comprehensiveDescription}
              </p>
              {item.subImages && item.subImages.length > 0 && (
                <div className="flex space-x-3 overflow-x-auto mb-4">
                  {item.subImages.map((img, index) => (
                    <img
                      key={index}
                      src={`http://localhost:5001/${img}`}
                      alt={`Sub Image ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg shadow-md"
                    />
                  ))}
                </div>
              )}
              {item.video && (
                <div className="mb-4">
                  <video
                    width="100%"
                    height="auto"
                    controls
                    className="rounded-lg shadow-md"
                  >
                    <source
                      src={`http://localhost:5001/${item.video}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              <div className="text-gray-600 text-sm mb-4">
                <p>
                  <span className="font-semibold">Cuisine Type:</span>{" "}
                  {item.cuisineType}
                </p>
                <p>
                  <span className="font-semibold">Meal Type:</span>{" "}
                  {item.mealType}
                </p>
                {item.nutritionValues && (
                  <div>
                    <h4 className="font-semibold">Nutrition Values:</h4>
                    <p>Protein: {item.nutritionValues.protein}g</p>
                    <p>Fat: {item.nutritionValues.fat}g</p>
                    <p>Carbs: {item.nutritionValues.carbs}g</p>
                    <p>Calories: {item.nutritionValues.calories} kcal</p>
                    <p>Vitamins: {item.nutritionValues.vitamins}</p>
                  </div>
                )}
              </div>
              <div className="text-gray-600 text-sm mb-4">
                <p>
                  <span className="font-semibold">Difficulty:</span>{" "}
                  {item.difficulty === "true" ? "High" : "Low"}
                </p>
                <p>
                  <span className="font-semibold">Meal Prep Friendly:</span>{" "}
                  {item.mealPrepFriendly ? "Yes" : "No"}
                </p>
                <p>
                  <span className="font-semibold">Freezable Recipe:</span>{" "}
                  {item.freezableRecipe ? "Yes" : "No"}
                </p>
                <p>
                  <span className="font-semibold">Dietary Restrictions:</span>{" "}
                  {item.dietaryRestrictions}
                </p>
              </div>
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => handleEditClick(item)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:shadow-outline transform hover:-translate-y-1 transition-transform duration-200"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleClickDelete(item._id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:shadow-outline transform hover:-translate-y-1 transition-transform duration-200"
                >
                  Delete
                </button>
              </div>{" "}
            </div>{" "}
          </div>
        ))}
      </div>{" "}
      <ConfirmDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default RecipesList;
