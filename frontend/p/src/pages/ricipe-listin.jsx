import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import RecipeCard from "../components/RecipeCard";
import Pagination from "../components/Pagination";

const RecipeCards = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
        const responseText = await response.text(); // Read the response as text
        console.log("Response Text:", responseText); // Log the response for debugging

        try {
          const data = JSON.parse(responseText); // Parse the text as JSON
          if (Array.isArray(data)) {
            setRecipes(data); // Directly set the array data
            setTotalPages(1); // You might need to adjust this if you have pagination info
          } else {
            console.error("Expected an array of recipes");
          }
        } catch (jsonError) {
          console.error("Failed to parse JSON:", jsonError);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
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

  return (
    <div className="container mx-auto p-4">
      <SearchBar onSearch={handleSearch} />
      <Filters onFilterChange={handleFilterChange} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(recipes) &&
          recipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} />
          ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default RecipeCards;
