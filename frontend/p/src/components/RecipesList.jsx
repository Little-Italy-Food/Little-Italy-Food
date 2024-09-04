import React, { useState } from "react";
import axios from "axios";
import EditRecipeModal from "./EditRecipeModal ";

const RecipesList = ({ items, setItems }) => {
  const [editingRecipe, setEditingRecipe] = useState(null);

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

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:5001/api/recipes/recipes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove deleted recipe from the local state
      setItems((prevItems) => prevItems.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  return (
    <div>
      {editingRecipe && (
        <EditRecipeModal
          editingRecipe={editingRecipe}
          setEditingRecipe={setEditingRecipe}
          handleSaveEdit={handleSaveEdit}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mt-10">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            {item.mainImage && (
              <img
                src={`http://localhost:5001/${item.mainImage}`}
                alt={item.name || "Recipe Image"}
                className="h-48 w-full"
              />
            )}

            <div className="p-4">
              <h3 className="font-bold text-xl mb-2">{item.name}</h3>
              <p className="text-gray-700 text-base mb-2">
                {item.briefDescription}
              </p>

              <p className="text-gray-600 text-sm mb-2">
                Cooking Time: {item?.cookingTime?.hours || ""}h{" "}
                {item?.cookingTime?.minutes || ""}m
              </p>

              <p className="text-gray-600 text-sm mb-2">
                Servings: {item.servings}
              </p>

              <div className="text-gray-600 text-sm mb-2">
                <h4 className="font-semibold mb-1">Ingredients:</h4>
                {Array.isArray(item.ingredients) &&
                item.ingredients.length > 0 ? (
                  <ul>
                    {item.ingredients.map((ingredient) => (
                      <li key={ingredient._id}>
                        {ingredient.ingredientsName}
                        {ingredient.quantity} {ingredient.unit} of{" "}
                        {ingredient.type}{" "}
                        {ingredient.alternative &&
                          ` (Alternative: ${ingredient.alternative})`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No ingredients listed.</p>
                )}
              </div>

              <p className="text-gray-700 text-base mb-2">
                {item.comprehensiveDescription}
              </p>

              {item.subImages && item.subImages.length > 0 && (
                <div className="flex space-x-2 mb-4">
                  {item.subImages.map((img, index) => (
                    <img
                      key={index}
                      src={`http://localhost:5001/${img}`}
                      alt={`Sub Image ${index + 1}`}
                      className="w-24 h-24 object-cover"
                    />
                  ))}
                </div>
              )}

              {item.video && (
                <div className="mb-4">
                  <video width="320" height="240" controls>
                    <source
                      src={`http://localhost:5001/${item.video}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              <p className="text-gray-600 text-sm mb-2">
                Cuisine Type: {item.cuisineType}
              </p>

              <p className="text-gray-600 text-sm mb-2">
                Meal Type: {item.mealType}
              </p>

              {item.nutritionValues && (
                <div className="text-gray-600 text-sm mb-2">
                  <h4 className="font-semibold mb-1">Nutrition Values:</h4>
                  <p>Protein: {item.nutritionValues.protein}g</p>
                  <p>Fat: {item.nutritionValues.fat}g</p>
                  <p>Carbs: {item.nutritionValues.carbs}g</p>
                  <p>Calories: {item.nutritionValues.calories} kcal</p>
                  <p>Vitamins: {item.nutritionValues.vitamins}</p>
                </div>
              )}

              <p className="text-gray-600 text-sm mb-2">
                Difficulty: {item.difficulty === "true" ? "High" : "Low"}
              </p>

              <p className="text-gray-600 text-sm mb-2">
                Meal Prep Friendly: {item.mealPrepFriendly ? "Yes" : "No"}
              </p>

              <p className="text-gray-600 text-sm mb-2">
                Freezable Recipe: {item.freezableRecipe ? "Yes" : "No"}
              </p>

              <p className="text-gray-600 text-sm mb-2">
                Dietary Restrictions: {item.dietaryRestrictions}
              </p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEditClick(item)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipesList;
