import React, { useEffect, useState } from "react";
import axios from "axios";
import HTMLFlipBook from "react-pageflip";

const PageCover = React.forwardRef((props, ref) => {
  return (
    <div className="cover" ref={ref} data-density="hard">
      <div>
        <h2>{props.children}</h2>
      </div>
    </div>
  );
});

const RecipePage = React.forwardRef((props, ref) => {
  const { recipe, pageNumber } = props;

  const formatTime = (time) => {
    return `${time.hours}h ${time.minutes}m`;
  };

  return (
    <div
      className="max-w-4xl mx-auto p-6 h-auto bg-white shadow-lg rounded-lg"
      ref={ref}
    >
      <div className="space-y-6 h-[150rem]">
        <h2 className="text-3xl font-bold text-gray-800">{recipe.name}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <img
              src={`http://localhost:5001/${recipe.mainImage}`}
              alt={recipe.name}
              className="w-full h-64 object-cover rounded-lg"
            />
            <p className="text-gray-600">
              <span className="font-semibold">Brief Description:</span>{" "}
              {recipe.briefDescription}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Comprehensive Description:</span>{" "}
              {recipe.comprehensiveDescription}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p>
                <span className="font-semibold">Cuisine:</span>{" "}
                {recipe.cuisineType}
              </p>
              <p>
                <span className="font-semibold">Dietary:</span>{" "}
                {recipe.dietaryRestrictions}
              </p>
              <p>
                <span className="font-semibold">Difficulty:</span>{" "}
                {recipe.difficulty}
              </p>
              <p>
                <span className="font-semibold">Cooking Time:</span>{" "}
                {formatTime(recipe.cookingTime)}
              </p>
              <p>
                <span className="font-semibold">Servings:</span>{" "}
                {recipe.servings}
              </p>
              <p>
                <span className="font-semibold">Meal Type:</span>{" "}
                {recipe.mealType}
              </p>
              <p>
                <span className="font-semibold">Freezable:</span>{" "}
                {recipe.freezableRecipe ? "Yes" : "No"}
              </p>
              <p>
                <span className="font-semibold">Meal Prep Friendly:</span>{" "}
                {recipe.mealPrepFriendly ? "Yes" : "No"}
              </p>
              <p>
                <span className="font-semibold">Rating:</span> {recipe.rating}/5
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
              <ul className="list-disc pl-5 space-y-1">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-600">
                    {ingredient.quantity} {ingredient.unit}{" "}
                    {ingredient.ingredientsName}
                    {ingredient.alternative && (
                      <span className="text-gray-500">
                        {" "}
                        (or {ingredient.alternative})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Nutrition Information
              </h3>
              <ul className="space-y-1">
                <li>
                  <span className="font-semibold">Calories:</span>{" "}
                  {recipe.nutritionValues.calories}
                </li>
                <li>
                  <span className="font-semibold">Carbs:</span>{" "}
                  {recipe.nutritionValues.carbs}g
                </li>
                <li>
                  <span className="font-semibold">Fat:</span>{" "}
                  {recipe.nutritionValues.fat}g
                </li>
                <li>
                  <span className="font-semibold">Protein:</span>{" "}
                  {recipe.nutritionValues.protein}g
                </li>
                <li>
                  <span className="font-semibold">Vitamins:</span>{" "}
                  {recipe.nutritionValues.vitamins}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Additional Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recipe.subImages.map((image, index) => (
              <img
                key={index}
                src={`http://localhost:5001/${image}`}
                alt={`Recipe image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Recipe Video</h3>
          <video controls className="w-full rounded-lg">
            <source
              src={`http://localhost:5001/${recipe.video}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <p className="mt-6 text-right text-gray-500">Page {pageNumber}</p>
    </div>
  );
});

const RecipesChef = ({ id }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5001/api/recipes/by-chef-id/${id}`
        );
        setRecipes(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setError("Failed to fetch recipes. Please try again later.");
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipes();
    }
  }, [id]);

  if (loading) {
    return <div>Loading recipes...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="recipe-book-container">
      <HTMLFlipBook
        width={600}
        height={2000}
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1500}
        showCover={true}
        flippingTime={1000}
        style={{ margin: "0 auto" }}
        maxShadowOpacity={0.5}
        className="recipe-book"
      >
        <PageCover>
          <img
            src="https://img.freepik.com/premium-photo/food-promotion-poster_1258715-104738.jpg?uid=R157407297&ga=GA1.1.336651591.1720684343&semt=ais_hybrid"
            alt=""
            height="150%"
          />
        </PageCover>
        {recipes.length > 0 ? (
          recipes.map((recipe, index) => (
            <RecipePage
              key={recipe._id}
              recipe={recipe}
              pageNumber={index + 1}
            />
          ))
        ) : (
          <RecipePage
            recipe={{
              name: "No Recipes",
              briefDescription: "There are no recipes to display.",
            }}
            pageNumber={1}
          />
        )}
        <PageCover>
          {" "}
          <img
            src="https://img.freepik.com/free-psd/italian-food-concept-poster-template_23-2148527233.jpg?uid=R157407297&ga=GA1.1.336651591.1720684343&semt=ais_hybrid"
            alt=""
            height="150%"
          />
        </PageCover>
      </HTMLFlipBook>
    </div>
  );
};

export default RecipesChef;
