import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import RecipeCard from "../components/RecipeCard";
import Pagination from "../components/Pagination";
import Modal from "../components/model/Modal";

import ForYou from "../components/ForYouSection";

import Video from "../assets/123629-728697948_tiny.mp4";

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
  const [noResults, setNoResults] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

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
          setIsModalOpen(true);
          setRecipes([]);
          setTotalPages(1);
        } else {
          const responseText = await response.text();

          try {
            const data = JSON.parse(responseText);
            if (Array.isArray(data)) {
              setRecipes(data);
              setTotalPages(1);
              setNoResults(false);
              setIsModalOpen(false);
            } else {
              console.error("Expected an array of recipes");
              setNoResults(true);
              setIsModalOpen(true);
            }
          } catch (jsonError) {
            console.error("Failed to parse JSON:", jsonError);
            setNoResults(true);
            setIsModalOpen(true);
          }
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setNoResults(true);
        setIsModalOpen(true);
      }
    };

    fetchRecipes();
  }, [searchQuery, filters, currentPage]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);

    const existingResults =
      JSON.parse(localStorage.getItem("searchResults")) || [];

    const newResults = filteredRecipes;

    const allResults = [...existingResults, ...newResults];
    const uniqueResults = Array.from(
      new Map(allResults.map((recipe) => [recipe.id, recipe])).values()
    );

    localStorage.setItem("searchResults", JSON.stringify(uniqueResults));
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
    setCurrentPage(1);
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
      setCurrentPage(1);
    };

    recognition.start();
  };

  const processFilters = (recipes) => {
    return recipes.filter((recipe) => {
      const totalCookingTime =
        (recipe.cookingTime.hours || 0) * 60 +
        (recipe.cookingTime.minutes || 0);

      const ingredientCount = recipe.ingredients.length;

      const maxCookingTime = parseInt(filters.time, 10) || Infinity;
      const minQuantity = parseInt(filters.ingredients, 10) || 0;

      const meetsIngredientFilter = recipe.ingredients.some(
        (ingredient) => ingredient.quantity >= minQuantity
      );

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
    <>
      <div className="relative font-sans">
        <video
          src={Video}
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-[35rem] object-cover"
        />

        <div
          className="absolute inset-0 bg-white bg-opacity-30 backdrop-blur-md"
          style={{ backdropFilter: "blur(5px)" }}
        />

        <div className="relative z-50 h-[35rem] max-w-6xl mx-auto flex flex-col justify-center items-center text-center text-white p-6">
          {/* Your content here */}
        </div>
      </div>

      <div className="container mx-auto">
        <SearchBar onSearch={handleSearch} onVoiceSearch={handleVoiceSearch} />
        <Filters onFilterChange={handleFilterChange} />

        {/* Ensure proper spacing and positioning of the grid */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 lg:px-20 mt-[5rem] ml-[30rem] mb-16">
            {noResults ? (
              <p className="text-center"></p>
            ) : filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} />
              ))
            ) : (
              <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
                <svg
                  className="text-gray-300 animate-spin"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                >
                  <path
                    d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-900"
                  ></path>
                </svg>
              </div>
            )}
          </div>
        </div>
        <div style={{ marginBottom: "96px" }}>
          {filteredRecipes.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
        {/* Modal for No Results */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <p className="text-center">No results found</p>
        </Modal>
      </div>
      <br />
      <ForYou />
      <br />
    </>
  );
};

export default RecipeCards;
