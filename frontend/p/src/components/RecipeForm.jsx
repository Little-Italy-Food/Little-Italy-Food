import React, { useState } from "react";

const RecipeForm = () => {
  const [ingredients, setIngredients] = useState([
    { type: "", quantity: "", unit: "" },
  ]);
  const [nutritionValues, setNutritionValues] = useState({
    protein: "",
    fat: "",
    carbs: "",
    calories: "",
    vitamins: "",
  });

  const addIngredient = () => {
    setIngredients([...ingredients, { type: "", quantity: "", unit: "" }]);
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const handleNutritionChange = (field, value) => {
    setNutritionValues({ ...nutritionValues, [field]: value });
  };

  return (
    <form className="p-6 bg-white shadow-md rounded-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add a New Recipe</h2>

      {/* Recipe Name */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Recipe Name
        </label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          placeholder="Enter the name of the recipe"
        />
      </div>

      {/* Serving Size */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Servings</label>
        <input
          type="number"
          className="w-full border rounded px-3 py-2"
          placeholder="Number of servings"
        />
      </div>

      {/* Ingredients */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Ingredients
        </label>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="mb-4 grid grid-cols-3 gap-4">
            <select
              className="border rounded px-3 py-2"
              value={ingredient.type}
              onChange={(e) =>
                handleIngredientChange(index, "type", e.target.value)
              }
            >
              <option value="" disabled>
                Select type
              </option>
              <option value="liquid">Liquid</option>
              <option value="powder">Powder</option>
              <option value="grains">Grains</option>
            </select>

            <input
              type="number"
              className="border rounded px-3 py-2"
              placeholder={
                ingredient.type === "grains" ? "Number of grains" : "Quantity"
              }
              value={ingredient.quantity}
              onChange={(e) =>
                handleIngredientChange(index, "quantity", e.target.value)
              }
            />

            <select
              className="border rounded px-3 py-2"
              value={ingredient.unit}
              onChange={(e) =>
                handleIngredientChange(index, "unit", e.target.value)
              }
              disabled={ingredient.type === "grains"}
            >
              <option value="" disabled>
                Select unit
              </option>
              {ingredient.type === "liquid" && (
                <>
                  <option value="ml">ml</option>
                  <option value="liter">liter</option>
                </>
              )}
              {ingredient.type === "powder" && (
                <>
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                </>
              )}
            </select>
          </div>
        ))}
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addIngredient}
        >
          Add Ingredient
        </button>
      </div>

      {/* Brief Description */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Brief Description
        </label>
        <textarea
          className="w-full border rounded px-3 py-2"
          placeholder="Enter a brief description"
        ></textarea>
      </div>

      {/* Comprehensive Description */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Comprehensive Description
        </label>
        <textarea
          className="w-full border rounded px-3 py-2"
          placeholder="Enter the detailed steps"
        ></textarea>
      </div>

      {/* Main Image */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Main Image
        </label>
        <input type="file" className="w-full border rounded px-3 py-2" />
      </div>

      {/* Sub Images */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Sub Images (4)
        </label>
        <input
          type="file"
          className="w-full border rounded px-3 py-2"
          multiple
        />
      </div>

      {/* Video */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Recipe Video
        </label>
        <input type="file" className="w-full border rounded px-3 py-2" />
      </div>

      {/* Cooking Time */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Cooking Time
        </label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          placeholder="Enter the cooking time"
        />
      </div>

      {/* Cuisine Type */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Cuisine Type
        </label>
        <select className="w-full border rounded px-3 py-2">
          <option value="pizza">Pizza</option>
          <option value="pasta">Pasta</option>
          <option value="soup">Soup</option>
          <option value="salad">Salad</option>
          <option value="seafood">Seafood</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Meal Type */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Meal Type
        </label>
        <select className="w-full border rounded px-3 py-2">
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="appetizers">Appetizers</option>
          <option value="salads">Salads</option>
          <option value="dessert">Dessert</option>
          <option value="snack">Snack</option>
        </select>
      </div>

      {/* Nutritional Values */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Nutritional Values
        </label>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            className="border rounded px-3 py-2"
            placeholder="Protein (g)"
            value={nutritionValues.protein}
            onChange={(e) => handleNutritionChange("protein", e.target.value)}
          />
          <input
            type="number"
            className="border rounded px-3 py-2"
            placeholder="Fat (g)"
            value={nutritionValues.fat}
            onChange={(e) => handleNutritionChange("fat", e.target.value)}
          />
          <input
            type="number"
            className="border rounded px-3 py-2"
            placeholder="Carbs (g)"
            value={nutritionValues.carbs}
            onChange={(e) => handleNutritionChange("carbs", e.target.value)}
          />
          <input
            type="number"
            className="border rounded px-3 py-2"
            placeholder="Calories (kcal)"
            value={nutritionValues.calories}
            onChange={(e) => handleNutritionChange("calories", e.target.value)}
          />
          <input
            type="text"
            className="border rounded px-3 py-2"
            placeholder="Vitamins"
            value={nutritionValues.vitamins}
            onChange={(e) => handleNutritionChange("vitamins", e.target.value)}
          />
        </div>
      </div>

      {/* Ingredient Alternatives */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Ingredient Alternatives
        </label>
        <textarea
          className="w-full border rounded px-3 py-2"
          placeholder="Enter alternatives for ingredients"
        ></textarea>
      </div>

      {/* Recipe Difficulty */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Recipe Difficulty
        </label>
        <select className="w-full border rounded px-3 py-2">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="difficult">Difficult</option>
        </select>
      </div>

      {/* Meal Prep Friendly */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          <input type="checkbox" className="mr-2" />
          Meal Prep Friendly
        </label>
      </div>

      {/* Freezable Recipe */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          <input type="checkbox" className="mr-2" />
          Freezable Recipe
        </label>
      </div>

      {/* Dietary Restrictions */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Dietary Restrictions (Optional)
        </label>
        <select className="w-full border rounded px-3 py-2">
          <option value="">None</option>
          <option value="gluten-free">Gluten-Free</option>
          <option value="vegan">Vegan</option>
          <option value="vegetarian">Vegetarian</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit Recipe
      </button>
    </form>
  );
};

export default RecipeForm;
