import React, { useState, useEffect } from "react";

const EditRecipeModal = ({
  editingRecipe,
  setEditingRecipe,
  handleSaveEdit,
}) => {
  const [recipeData, setRecipeData] = useState(editingRecipe);

  useEffect(() => {
    setRecipeData(editingRecipe);
  }, [editingRecipe]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipeData({
      ...recipeData,
      [name]: value,
    });
  };

  const handleNestedChange = (e, path) => {
    const { name, value } = e.target;
    const keys = path.split(".");
    const updatedRecipe = { ...recipeData };

    let current = updatedRecipe;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key][name] = value;
      } else {
        current = current[key];
      }
    });

    setRecipeData(updatedRecipe);
  };

  const handleArrayChange = (e, index, path) => {
    const { name, value } = e.target;
    const keys = path.split(".");
    const updatedRecipe = { ...recipeData };

    let current = updatedRecipe;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key][index][name] = value;
      } else {
        current = current[key];
      }
    });

    setRecipeData(updatedRecipe);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setRecipeData({
      ...recipeData,
      [name]: files.length > 0 ? files[0] : null,
    });
  };

  const handleFilesChange = (e) => {
    const { name, files } = e.target;
    setRecipeData({
      ...recipeData,
      [name]: Array.from(files),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSaveEdit(recipeData);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl h-[85%] overflow-y-auto mx-4 sm:mx-auto">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">
          Edit Recipe
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <label className="block">
              <span className="text-gray-700">Name:</span>
              <input
                type="text"
                name="name"
                value={recipeData.name}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Brief Description:</span>
              <input
                type="text"
                name="briefDescription"
                value={recipeData.briefDescription}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Comprehensive Description:</span>
              <input
                type="text"
                name="comprehensiveDescription"
                value={recipeData.comprehensiveDescription}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Servings:</span>
              <input
                type="number"
                name="servings"
                value={recipeData.servings}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Cooking Time (Hours):</span>
              <input
                type="number"
                name="hours"
                value={recipeData.cookingTime?.hours || ""}
                onChange={(e) => handleNestedChange(e, "cookingTime")}
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Cooking Time (Minutes):</span>
              <input
                type="number"
                name="minutes"
                value={recipeData.cookingTime?.minutes || ""}
                onChange={(e) => handleNestedChange(e, "cookingTime")}
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Cuisine Type:</span>
              <input
                type="text"
                name="cuisineType"
                value={recipeData.cuisineType}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Meal Type:</span>
              <input
                type="text"
                name="mealType"
                value={recipeData.mealType}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Difficulty:</span>
              <input
                type="text"
                name="difficulty"
                value={recipeData.difficulty}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Dietary Restrictions:</span>
              <input
                type="text"
                name="dietaryRestrictions"
                value={recipeData.dietaryRestrictions}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Nutrition Values (Protein):</span>
              <input
                type="number"
                name="protein"
                value={recipeData.nutritionValues?.protein || ""}
                onChange={(e) => handleNestedChange(e, "nutritionValues")}
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Nutrition Values (Fat):</span>
              <input
                type="number"
                name="fat"
                value={recipeData.nutritionValues?.fat || ""}
                onChange={(e) => handleNestedChange(e, "nutritionValues")}
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Nutrition Values (Carbs):</span>
              <input
                type="number"
                name="carbs"
                value={recipeData.nutritionValues?.carbs || ""}
                onChange={(e) => handleNestedChange(e, "nutritionValues")}
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">
                Nutrition Values (Calories):
              </span>
              <input
                type="number"
                name="calories"
                value={recipeData.nutritionValues?.calories || ""}
                onChange={(e) => handleNestedChange(e, "nutritionValues")}
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Vitamins:</span>
              <input
                type="text"
                name="vitamins"
                value={recipeData.nutritionValues?.vitamins || ""}
                onChange={(e) => handleNestedChange(e, "nutritionValues")}
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-opacity-50"
              />
            </label>
          </div>

          {/* Ingredients */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Ingredients
            </h3>
            {recipeData.ingredients?.map((ingredient, index) => (
              <div key={index} className="mb-6">
                <h4 className="text-lg font-semibold text-gray-600 mb-2">
                  Ingredient {index + 1}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-gray-700">Type:</span>
                    <input
                      type="text"
                      name="type"
                      value={ingredient.type}
                      onChange={(e) =>
                        handleArrayChange(e, index, "ingredients")
                      }
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-opacity-50"
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">Quantity:</span>
                    <input
                      type="number"
                      name="quantity"
                      value={ingredient.quantity}
                      onChange={(e) =>
                        handleArrayChange(e, index, "ingredients")
                      }
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-opacity-50"
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">Unit:</span>
                    <input
                      type="text"
                      name="unit"
                      value={ingredient.unit}
                      onChange={(e) =>
                        handleArrayChange(e, index, "ingredients")
                      }
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-opacity-50"
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">Alternative:</span>
                    <input
                      type="text"
                      name="alternative"
                      value={ingredient.alternative}
                      onChange={(e) =>
                        handleArrayChange(e, index, "ingredients")
                      }
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-opacity-50"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            >
              Update Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecipeModal;
