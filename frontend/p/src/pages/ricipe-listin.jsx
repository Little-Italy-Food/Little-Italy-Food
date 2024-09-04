// RecipeCards.js
import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import RecipeCard from "../components/RecipeCard";
import Pagination from "../components/Pagination";

const RecipeCards = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    time: "",
    ingredients: "",
    diet: "",
    mealType: "",
    sortBy: "",
    sortOrder: "",
    difficulty: "",
  });

  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [noResults, setNoResults] = useState(false); // State to handle no results found

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const queryParams = new URLSearchParams({
          ...filters,
          search: searchQuery,
          page: currentPage,
        }).toString();

        const response = await fetch(
          `http://localhost:5001/api/recipes/recipes-get?${queryParams}`
        );

        if (response.status === 404) {
          setNoResults(true);
          setRecipes([]);
          setTotalPages(1); // Reset total pages if no results
        } else {
          const responseText = await response.text(); // Read the response as text

          try {
            const data = JSON.parse(responseText); // Parse the text as JSON
            if (Array.isArray(data)) {
              setRecipes(data); // Directly set the array data
              setTotalPages(1); // Adjust this if you have pagination info from the API
              setNoResults(false); // Reset no results flag if data is received
            } else {
              console.error("Expected an array of recipes");
              setNoResults(true);
            }
          } catch (jsonError) {
            console.error("Failed to parse JSON:", jsonError);
            setNoResults(true);
          }
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setNoResults(true); // Handle any other errors as no results
      }
    };

    fetchRecipes();
  }, [searchQuery, filters, currentPage]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to the first page on new search
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
    setCurrentPage(1); // Reset to the first page on new filter
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleVoiceSearch = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setCurrentPage(1); // Reset to the first page on new search
    };

    recognition.start();
  };

  // Helper function to process filter values
  const processFilters = (recipes) => {
    return recipes.filter((recipe) => {
      // Convert cookingTime to total minutes
      const totalCookingTime =
        (recipe.cookingTime.hours || 0) * 60 +
        (recipe.cookingTime.minutes || 0);

      // Count ingredients
      const ingredientCount = recipe.ingredients.length;

      // Ensure the filter values are numbers for comparison
      const maxCookingTime = parseInt(filters.time, 10) || Infinity;
      const minQuantity = parseInt(filters.ingredients, 10) || 0;

      // Check if any ingredient's quantity is greater than or equal to the filter value
      const meetsIngredientFilter = recipe.ingredients.some(
        (ingredient) => ingredient.quantity >= minQuantity
      );

      // Check dietary restrictions
      const dietaryRestrictions = filters.diet
        .split(",")
        .map((item) => item.trim());
      const meetsDietaryRestrictions =
        dietaryRestrictions.length === 0 ||
        dietaryRestrictions.some((restriction) =>
          recipe.dietaryRestrictions.includes(restriction)
        );

      return (
        (filters.time === "" || totalCookingTime <= maxCookingTime) &&
        (filters.ingredients === "" || meetsIngredientFilter) &&
        (filters.diet === "" || meetsDietaryRestrictions)
      );
    });
  };

  const filteredRecipes = processFilters(recipes);

  return (
    <div className="container mx-auto">
      <SearchBar onSearch={handleSearch} onVoiceSearch={handleVoiceSearch} />
      <Filters onFilterChange={handleFilterChange} />
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-1">
        {noResults ? (
          <p className="text-center">No results found</p>
        ) : filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} />
          ))
        ) : (
          <p className="text-center">Loading...</p>
        )}
      </div>
      {filteredRecipes.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default RecipeCards;
