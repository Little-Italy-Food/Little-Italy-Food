import React from "react";

const RecipesList = ({ items, handleEdit, handleDelete }) => {
  console.log(items);

  if (items.length === 0) {
    return (
      <p className="text-gray-600 text-center mt-4">No recipes available.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mt-10">
      {items.map((item) => (
        <div
          key={item._id}
          className="bg-white shadow-md rounded-lg overflow-hidden"
        >
          {/* Main Image */}
          {item.mainImage && (
            <div
              className="h-48 bg-cover bg-center"
              style={{
                backgroundImage: `url(http://localhost:5001/${item.mainImage})`,
              }}
            />
          )}
          <div className="p-4">
            <h3 className="font-bold text-xl mb-2">{item.name}</h3>
            <p className="text-gray-700 text-base mb-2">
              {item.briefDescription}
            </p>

            {/* Cooking Time */}
            <p className="text-gray-600 text-sm mb-2">
              Cooking Time: {item?.cookingTime?.hours || ""}h{" "}
              {item?.cookingTime?.minutes || ""}m
            </p>

            {/* Servings */}
            <p className="text-gray-600 text-sm mb-2">
              Servings: {item.servings}
            </p>

            {/* Ingredients */}
            <div className="text-gray-600 text-sm mb-2">
              <h4 className="font-semibold mb-1">Ingredients:</h4>
              {Array.isArray(item.ingredients) &&
              item.ingredients.length > 0 ? (
                <ul>
                  {item.ingredients.map((ingredient) => (
                    <li key={ingredient._id}>
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

            {/* Comprehensive Description */}
            <p className="text-gray-700 text-base mb-2">
              {item.comprehensiveDescription}
            </p>

            {/* Sub Images */}
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

            {/* Video */}
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

            {/* Cuisine Type */}
            <p className="text-gray-600 text-sm mb-2">
              Cuisine Type: {item.cuisineType}
            </p>

            {/* Meal Type */}
            <p className="text-gray-600 text-sm mb-2">
              Meal Type: {item.mealType}
            </p>

            {/* Nutrition Values */}
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

            {/* Difficulty */}
            <p className="text-gray-600 text-sm mb-2">
              Difficulty: {item.difficulty === "true" ? "High" : "Low"}
            </p>

            {/* Meal Prep Friendly */}
            <p className="text-gray-600 text-sm mb-2">
              Meal Prep Friendly: {item.mealPrepFriendly ? "Yes" : "No"}
            </p>

            {/* Freezable Recipe */}
            <p className="text-gray-600 text-sm mb-2">
              Freezable Recipe: {item.freezableRecipe ? "Yes" : "No"}
            </p>

            {/* Dietary Restrictions */}
            <p className="text-gray-600 text-sm mb-2">
              Dietary Restrictions: {item.dietaryRestrictions}
            </p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEdit(item)}
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
  );
};

export default RecipesList;
