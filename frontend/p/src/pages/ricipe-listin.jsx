import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import RecipeCard from "../components/RecipeCard";
import Pagination from "../components/Pagination";

const sampleRecipes = [
  {
    name: "Spaghetti Carbonara",
    description: "A classic Italian pasta dish...",
  },
  {
    name: "Chicken Caesar Salad",
    description: "Crisp romaine with grilled chicken...",
  },
  // Add more sample recipes
];

function RecipeCards() {
  const [currentPage, setCurrentPage] = useState(0);
  const recipesPerPage = 10;

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const displayedRecipes = sampleRecipes.slice(
    currentPage * recipesPerPage,
    (currentPage + 1) * recipesPerPage
  );

  return (
    <div className="container mx-auto p-4">
      <SearchBar />
      <Filters />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedRecipes.map((recipe, index) => (
          <RecipeCard key={index} recipe={recipe} />
        ))}
      </div>
      <Pagination
        pageCount={Math.ceil(sampleRecipes.length / recipesPerPage)}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default RecipeCards;
