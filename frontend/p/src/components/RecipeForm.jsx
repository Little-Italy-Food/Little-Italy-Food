import React, { useState } from "react";
import axios from "axios";

const RecipeForm = () => {
  const [ingredients, setIngredients] = useState([
    { type: "", quantity: "", unit: "", alternative: "", ingredientsName: "" },
  ]);

  const [nutritionValues, setNutritionValues] = useState({
    protein: "",
    fat: "",
    carbs: "",
    calories: "",
    vitamins: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    servings: "",
    briefDescription: "",
    comprehensiveDescription: "",
    cookingTime: { hours: "", minutes: "" },
    cuisineType: "",
    mealType: "",
    difficulty: "",
    mealPrepFriendly: false,
    freezableRecipe: false,
    dietaryRestrictions: "",
  });

  const [files, setFiles] = useState({
    mainImage: null,
    subImages: [],
    video: null,
  });

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      {
        type: "",
        quantity: "",
        unit: "",
        alternative: "",
        ingredientsName: "",
      },
    ]);
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const handleNutritionChange = (field, value) => {
    setNutritionValues({ ...nutritionValues, [field]: value });
  };

  const handleFileChange = (event) => {
    const { name, files: selectedFiles } = event.target;

    if (name === "subImages") {
      setFiles((prevFiles) => ({
        ...prevFiles,
        [name]: Array.from(selectedFiles),
      }));
    } else {
      setFiles((prevFiles) => ({
        ...prevFiles,
        [name]: selectedFiles,
      }));
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === "checkbox") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: checked,
      }));
    } else if (name.includes("cookingTime")) {
      const [key, subKey] = name.split(".");
      setFormData((prevFormData) => ({
        ...prevFormData,
        cookingTime: {
          ...prevFormData.cookingTime,
          [subKey]: value,
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("servings", formData.servings);
    data.append("briefDescription", formData.briefDescription);
    data.append("comprehensiveDescription", formData.comprehensiveDescription);
    data.append("cookingTime", JSON.stringify(formData.cookingTime));
    data.append("cuisineType", formData.cuisineType);
    data.append("mealType", formData.mealType);
    data.append("difficulty", formData.difficulty);
    data.append("mealPrepFriendly", formData.mealPrepFriendly);
    data.append("freezableRecipe", formData.freezableRecipe);
    data.append("dietaryRestrictions", formData.dietaryRestrictions);

    data.append("ingredients", JSON.stringify(ingredients));
    data.append("nutritionValues", JSON.stringify(nutritionValues));

    if (files.mainImage) data.append("mainImage", files.mainImage[0]);

    if (Array.isArray(files.subImages)) {
      files.subImages.forEach((file, index) => data.append(`subImages`, file));
    }

    if (files.video) data.append("video", files.video[0]);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5001/api/recipes/recipes",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error creating recipe:", error);
      alert("Error creating recipe. Please check the console for details.");
    }
  };

  return (
    <form
      className="p-6 bg-white shadow-md rounded-lg  "
      onSubmit={handleSubmit}
    >
      {/* MY form fields */}
      {/* Recipe Name */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Recipe Name
        </label>
        <input
          type="text"
          name="name"
          className="w-full border rounded px-3 py-2"
          placeholder="Enter the name of the recipe"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      {/* Serving Size */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Servings</label>
        <input
          type="number"
          name="servings"
          className="w-full border rounded px-3 py-2"
          placeholder="Number of servings"
          value={formData.servings}
          onChange={handleChange}
        />
      </div>

      {/*fullll Ingredients Section */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Ingredients
        </label>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="mb-4 grid grid-cols-4 gap-4">
            {/* Ingredient Name */}
            <input
              type="text"
              className="border rounded px-3 py-2"
              placeholder="Ingredient Name"
              value={ingredient.ingredientsName}
              onChange={(e) =>
                handleIngredientChange(index, "ingredientsName", e.target.value)
              }
            />

            {/* Ingredient Type */}
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

            {/* Quantity */}
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

            {/* Unit */}
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

            {/* Alternative Ingredient */}
            <input
              type="text"
              className="border rounded px-3 py-2 col-span-4"
              placeholder="Alternative ingredient (optional)"
              value={ingredient.alternative}
              onChange={(e) =>
                handleIngredientChange(index, "alternative", e.target.value)
              }
            />
          </div>
        ))}
        <button
          type="button"
          className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
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
          name="briefDescription"
          className="w-full border rounded px-3 py-2"
          placeholder="Enter a brief description"
          value={formData.briefDescription}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* Comprehensive Description */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Comprehensive Description
        </label>
        <textarea
          name="comprehensiveDescription"
          className="w-full border rounded px-3 py-2"
          placeholder="Enter the detailed steps"
          value={formData.comprehensiveDescription}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* Main Image */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Main Image
        </label>
        <input
          type="file"
          name="mainImage"
          className="w-full border rounded px-3 py-2"
          onChange={handleFileChange}
        />
      </div>

      {/* Sub Images */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Sub Images (4)
        </label>
        <input
          type="file"
          name="subImages"
          className="w-full border rounded px-3 py-2"
          multiple
          onChange={handleFileChange}
        />
      </div>

      {/* Video */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Recipe Video
        </label>
        <input
          type="file"
          name="video"
          className="w-full border rounded px-3 py-2"
          onChange={handleFileChange}
        />
      </div>

      {/* Cooking Time */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Cooking Time
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              name="cookingTime.hours"
              className="w-full border rounded px-3 py-2"
              placeholder="Hours"
              min="0"
              value={formData.cookingTime.hours}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="number"
              name="cookingTime.minutes"
              className="w-full border rounded px-3 py-2"
              placeholder="Minutes"
              min="0"
              max="59"
              value={formData.cookingTime.minutes}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Cuisine Type */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Cuisine Type
        </label>
        <select
          name="cuisineType"
          className="w-full border rounded px-3 py-2"
          value={formData.cuisineType}
          onChange={handleChange}
        >
          <option value="pizza">Pizza</option>
          <option value="pasta">Pasta</option>
          <option value="soup">Soup</option>
          <option value="salad">Salad</option>
          <option value="seafood">Seafood</option>
        </select>
      </div>

      {/* Meal Type */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Meal Type
        </label>
        <select
          name="mealType"
          className="w-full border rounded px-3 py-2"
          value={formData.mealType}
          onChange={handleChange}
        >
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
            name="protein"
            className="border rounded px-3 py-2"
            placeholder="Protein (g)"
            value={nutritionValues.protein}
            onChange={(e) => handleNutritionChange("protein", e.target.value)}
          />
          <input
            type="number"
            name="fat"
            className="border rounded px-3 py-2"
            placeholder="Fat (g)"
            value={nutritionValues.fat}
            onChange={(e) => handleNutritionChange("fat", e.target.value)}
          />
          <input
            type="number"
            name="carbs"
            className="border rounded px-3 py-2"
            placeholder="Carbs (g)"
            value={nutritionValues.carbs}
            onChange={(e) => handleNutritionChange("carbs", e.target.value)}
          />
          <input
            type="number"
            name="calories"
            className="border rounded px-3 py-2"
            placeholder="Calories (kcal)"
            value={nutritionValues.calories}
            onChange={(e) => handleNutritionChange("calories", e.target.value)}
          />
          <input
            type="text"
            name="vitamins"
            className="border rounded px-3 py-2"
            placeholder="Vitamins"
            value={nutritionValues.vitamins}
            onChange={(e) => handleNutritionChange("vitamins", e.target.value)}
          />
        </div>
      </div>

      {/* Recipe Difficulty */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Recipe Difficulty
        </label>
        <select
          name="difficulty"
          className="w-full border rounded px-3 py-2"
          value={formData.difficulty}
          onChange={handleChange}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="difficult">Difficult</option>
        </select>
      </div>

      {/* Meal Prep Friendly */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          <input
            type="checkbox"
            name="mealPrepFriendly"
            className="mr-2"
            checked={formData.mealPrepFriendly}
            onChange={handleChange}
          />
          Meal Prep Friendly
        </label>
      </div>

      {/* Freezable Recipe */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          <input
            type="checkbox"
            name="freezableRecipe"
            className="mr-2"
            checked={formData.freezableRecipe}
            onChange={handleChange}
          />
          Freezable Recipe
        </label>
      </div>

      {/* Dietary Restrictions */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Dietary Restrictions (Optional)
        </label>
        <select
          name="dietaryRestrictions"
          className="w-full border rounded px-3 py-2"
          value={formData.dietaryRestrictions}
          onChange={handleChange}
        >
          <option value="">None</option>
          <option value="gluten-free">Gluten-Free</option>
          <option value="vegan">Vegan</option>
          <option value="vegetarian">Vegetarian</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Submit Recipe
      </button>
    </form>
  );
};

export default RecipeForm;
