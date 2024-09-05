import React, { useState, useEffect } from "react";

const EditRecipeModal = ({
  editingRecipe,
  setEditingRecipe,
  handleSaveEdit,
  onClose,
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

  const handleAddArrayItem = (path) => {
    const keys = path.split(".");
    const updatedRecipe = { ...recipeData };

    let current = updatedRecipe;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = [
          ...current[key],
          { ingredientsName: "", type: "", quantity: "", unit: "" },
        ];
      } else {
        current = current[key];
      }
    });

    setRecipeData(updatedRecipe);
  };

  const handleRemoveArrayItem = (index, path) => {
    const keys = path.split(".");
    const updatedRecipe = { ...recipeData };

    let current = updatedRecipe;
    keys.forEach((key, idx) => {
      if (idx === keys.length - 1) {
        current[key] = current[key].filter((_, i) => i !== index);
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
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl mx-auto h-[80%] overflow-y-scroll">
        <h2 className="text-2xl font-bold mb-6">Edit Recipe</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="text-lg font-medium">Name:</span>
              <input
                type="text"
                name="name"
                value={recipeData.name}
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 text-lg border-2 border-green-500 rounded-lg shadow-sm focus:border-green-600 focus:ring-green-600 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-lg font-medium">Brief Description:</span>
              <input
                type="text"
                name="briefDescription"
                value={recipeData.briefDescription}
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 text-lg border-2 border-green-500 rounded-lg shadow-sm focus:border-green-600 focus:ring-green-600 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-lg font-medium">
                Comprehensive Description:
              </span>
              <input
                type="text"
                name="comprehensiveDescription"
                value={recipeData.comprehensiveDescription}
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 text-lg border-2 border-green-500 rounded-lg shadow-sm focus:border-green-600 focus:ring-green-600 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-lg font-medium">Servings:</span>
              <input
                type="number"
                name="servings"
                value={recipeData.servings}
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 text-lg border-2 border-green-500 rounded-lg shadow-sm focus:border-green-600 focus:ring-green-600 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-lg font-medium">Cooking Time (Hours):</span>
              <input
                type="number"
                name="hours"
                value={recipeData.cookingTime?.hours || ""}
                onChange={(e) => handleNestedChange(e, "cookingTime")}
                className="mt-2 block w-full px-4 py-3 text-lg border-2 border-green-500 rounded-lg shadow-sm focus:border-green-600 focus:ring-green-600 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-lg font-medium">
                Cooking Time (Minutes):
              </span>
              <input
                type="number"
                name="minutes"
                value={recipeData.cookingTime?.minutes || ""}
                onChange={(e) => handleNestedChange(e, "cookingTime")}
                className="mt-2 block w-full px-4 py-3 text-lg border-2 border-green-500 rounded-lg shadow-sm focus:border-green-600 focus:ring-green-600 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-lg font-medium">Cuisine Type:</span>
              <input
                type="text"
                name="cuisineType"
                value={recipeData.cuisineType}
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 text-lg border-2 border-green-500 rounded-lg shadow-sm focus:border-green-600 focus:ring-green-600 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-lg font-medium">Meal Type:</span>
              <input
                type="text"
                name="mealType"
                value={recipeData.mealType}
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 text-lg border-2 border-green-500 rounded-lg shadow-sm focus:border-green-600 focus:ring-green-600 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-lg font-medium">Difficulty:</span>
              <input
                type="text"
                name="difficulty"
                value={recipeData.difficulty}
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 text-lg border-2 border-green-500 rounded-lg shadow-sm focus:border-green-600 focus:ring-green-600 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-lg font-medium">Dietary Restrictions:</span>
              <input
                type="text"
                name="dietaryRestrictions"
                value={recipeData.dietaryRestrictions}
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 text-lg border-2 border-green-500 rounded-lg shadow-sm focus:border-green-600 focus:ring-green-600 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-lg font-medium">
                Nutrition Values (Protein):
              </span>
              <input
                type="number"
                name="protein"
                value={recipeData.nutritionValues?.protein || ""}
                onChange={(e) => handleNestedChange(e, "nutritionValues")}
                className="mt-2 block w-full px-4 py-3 text-lg border-2 border-green-400 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-lg font-medium">
                Nutrition Values (Fat):
              </span>
              <input
                type="number"
                name="fat"
                value={recipeData.nutritionValues?.fat || ""}
                onChange={(e) => handleNestedChange(e, "nutritionValues")}
                className="mt-2 block w-full px-4 py-3 text-lg border-2 border-green-400 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-lg font-medium">
                Nutrition Values (Carbs):
              </span>
              <input
                type="number"
                name="carbs"
                value={recipeData.nutritionValues?.carbs || ""}
                onChange={(e) => handleNestedChange(e, "nutritionValues")}
                className="mt-2 block w-full px-4 py-3 text-lg border-2 border-green-400 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-lg font-medium">
                Nutrition Values (Calories):
              </span>
              <input
                type="number"
                name="calories"
                value={recipeData.nutritionValues?.calories || ""}
                onChange={(e) => handleNestedChange(e, "nutritionValues")}
                className="mt-2 block w-full px-4 py-3 text-lg border-2 border-green-400 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-lg font-medium">Vitamins:</span>
              <input
                type="text"
                name="vitamins"
                value={recipeData.nutritionValues?.vitamins || ""}
                onChange={(e) => handleNestedChange(e, "nutritionValues")}
                className="mt-2 block w-full px-4 py-3 text-lg border-2 border-green-400 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 focus:ring-opacity-50"
              />
            </label>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Ingredients</h3>
            {recipeData.ingredients?.map((ingredient, index) => (
              <div key={index} className="mb-6 p-4 bg-gray-100 rounded-lg">
                <h4 className="text-lg font-semibold">
                  Ingredient {index + 1}
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                  <label className="block">
                    <span className="text-lg font-medium">Name:</span>
                    <input
                      type="text"
                      name="name"
                      value={ingredient.ingredientsName}
                      onChange={(e) =>
                        handleArrayChange(e, index, "ingredients")
                      }
                      className="mt-2 block w-full px-4 py-3 text-lg border-2 border-green-500 rounded-lg shadow-sm focus:border-green-600 focus:ring-green-600 focus:ring-opacity-50"
                    />
                  </label>
                  <label className="block">
                    <span className="text-lg font-medium">Type:</span>
                    <select
                      name="type"
                      value={ingredient.type}
                      onChange={(e) =>
                        handleArrayChange(e, index, "ingredients")
                      }
                      className="mt-2 block w-full px-4 py-3 text-lg border-2 border-green-500 rounded-lg shadow-sm focus:border-green-600 focus:ring-green-600 focus:ring-opacity-50"
                    >
                      <option value="">Select type</option>
                      <option value="Liquid">Liquid</option>
                      <option value="Powder">Powder</option>
                      <option value="Grains">Grains</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-lg font-medium">Amount:</span>
                    <input
                      type="text"
                      name="amount"
                      value={ingredient.quantity}
                      onChange={(e) =>
                        handleArrayChange(e, index, "ingredients")
                      }
                      className="mt-2 block w-full px-4 py-3 text-lg border-2 border-green-500 rounded-lg shadow-sm focus:border-green-600 focus:ring-green-600 focus:ring-opacity-50"
                    />
                  </label>
                  {ingredient.type === "Liquid" && (
                    <label className="block">
                      <span className="text-lg font-medium">Unit:</span>
                      <select
                        name="unit"
                        value={ingredient.unit}
                        onChange={(e) =>
                          handleArrayChange(e, index, "ingredients")
                        }
                        className="mt-2 block w-full px-4 py-3 text-lg border-2 border-green-500 rounded-lg shadow-sm focus:border-green-600 focus:ring-green-600 focus:ring-opacity-50"
                      >
                        <option value="">Select unit</option>
                        <option value="l">Liter</option>
                        <option value="ml">Milliliter</option>
                      </select>
                    </label>
                  )}
                  {ingredient.type === "Powder" && (
                    <label className="block">
                      <span className="text-lg font-medium">Unit:</span>
                      <select
                        name="unit"
                        value={ingredient.unit}
                        onChange={(e) =>
                          handleArrayChange(e, index, "ingredients")
                        }
                        className="mt-2 block w-full px-4 py-3 text-lg border-2 border-green-500 rounded-lg shadow-sm focus:border-green-600 focus:ring-green-600 focus:ring-opacity-50"
                      >
                        <option value="">Select unit</option>
                        <option value="g">Gram</option>
                        <option value="kg">Kilogram</option>
                      </select>
                    </label>
                  )}
                  {ingredient.type === "Grains" && (
                    <label className="block">
                      <span className="text-lg font-medium">Unit:</span>
                      <input
                        type="text"
                        name="unit"
                        value={ingredient.unit}
                        onChange={(e) =>
                          handleArrayChange(e, index, "ingredients")
                        }
                        className="mt-2 block w-full px-4 py-3 text-lg border-2 border-green-500 rounded-lg shadow-sm focus:border-green-600 focus:ring-green-600 focus:ring-opacity-50"
                        readOnly
                      />
                    </label>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem(index, "ingredients")}
                    className="mt-2 text-lg font-medium text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg shadow-sm p-0"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddArrayItem("ingredients")}
              className="mt-4 text-lg font-medium text-white bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg shadow-sm"
            >
              Add Ingredient
            </button>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Main Image</h3>
            <input
              type="file"
              name="mainImage"
              onChange={handleFileChange}
              className="block w-full text-lg text-gray-900 border-2 border-green-500 rounded-lg shadow-sm focus:border-green-600 focus:ring-green-600 focus:ring-opacity-50"
            />
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Sub Images</h3>
            <input
              type="file"
              name="subImages"
              multiple
              onChange={handleFilesChange}
              className="block w-full text-lg text-gray-900 border-2 border-green-500 rounded-lg shadow-sm focus:border-green-600 focus:ring-green-600 focus:ring-opacity-50"
            />
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Video</h3>
            <input
              type="file"
              name="video"
              onChange={handleFileChange}
              className="block w-full text-lg text-gray-900 border-2 border-green-500 rounded-lg shadow-sm focus:border-green-600 focus:ring-green-600 focus:ring-opacity-50"
            />
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="text-lg font-medium text-white bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg shadow-sm"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-4 text-lg font-medium text-white bg-gray-500 hover:bg-gray-600 px-6 py-3 rounded-lg shadow-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecipeModal;
