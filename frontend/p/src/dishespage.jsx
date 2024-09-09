import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Pizza, Euro, Info, Search } from "lucide-react";
import Navbar from "./navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useSpring, animated } from "react-spring";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const ITEMS_PER_PAGE = 6;

const DishesPage = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // Slice dishes for the current page
  const paginatedDishes = dishes.slice(startIndex, endIndex);

  // Calculate total pages
  const totalPages = Math.ceil(dishes.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/dishescategory"
        );
        setDishes(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching dishes. Please try again later.");
        setLoading(false);
      }
    };
    fetchDishes();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSliderChange = (value) => {
    setPriceRange(value);
  };

  const filteredDishes = dishes
    .filter((dish) => {
      if (selectedCategory === "All") return true;
      return dish.category === selectedCategory;
    })
    .filter((dish) => {
      const price = parseFloat(dish.price);
      return price >= priceRange[0] && price <= priceRange[1];
    })
    .filter((dish) =>
      dish.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const fadeIn = useSpring({
    opacity: loading ? 0 : 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-orange-700"
        >
          Loading dishes...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.div>
      </div>
    );
  }

  return (
    <animated.div style={fadeIn} className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold text-center mb-12 text-orange-700 font-serif"
        >
          Piatti Deliziosi
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col md:flex-row md:justify-between mb-8 lg:px-20 space-y-4 md:space-y-0 md:space-x-4"
        >
          <div className="flex items-center bg-white rounded-full shadow-md md:w-1/3">
            <label htmlFor="category" className="sr-only">
              Filter by Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="appearance-none bg-transparent border-none px-4 py-2 rounded-full focus:outline-none w-full"
            >
              <option value="All">All Categories</option>
              <option value="pasta">Pasta</option>
              <option value="pizza">Pizza</option>
              <option value="soup">Soup</option>
              <option value="seafood">Seafood</option>
            </select>
          </div>

          <div className="relative md:w-1/3">
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-orange-300 focus:outline-none focus:border-orange-500 transition-colors duration-300"
            />
            <Search className="absolute left-3 top-[1.3rem] transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex-1 max-w-sm md:w-1/3 ">
            <Slider
              range
              min={0}
              max={50}
              defaultValue={priceRange}
              onChange={handleSliderChange}
              trackStyle={[{ backgroundColor: "#FF5733" }]}
              handleStyle={[
                { backgroundColor: "#2a9d8f", borderColor: "#2a9d8f" },
                { backgroundColor: "#2a9d8f", borderColor: "#2a9d8f" },
              ]}
              railStyle={{ backgroundColor: "#e5e7eb" }}
            />
            <div className="flex justify-between text-sm text-gray-700 mt-2">
              <span>€{priceRange[0]}</span>
              <span>€{priceRange[1]}</span>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 sm:px-6 md:px-8 lg:px-20"
          >
            {paginatedDishes.map((dish) => (
              <motion.div
                key={dish._id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-orange-200 transform hover:scale-105"
              >
                <div className="relative pt-[75%]">
                  <img
                    src={dish.imageUrl || "/api/placeholder/400/300"}
                    alt={dish.title}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 m-2 rounded-full text-xs font-bold">
                    {dish.category}
                  </div>
                </div>

                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2 text-red-700 font-serif truncate">
                    {dish.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2 italic line-clamp-2">
                    {dish.description}
                  </p>
                </div>

                <div className="bg-gray-50 p-3 flex justify-between items-center text-xs">
                  <div className="flex items-center">
                    <Pizza className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-gray-600 truncate max-w-[150px]">
                      {Array.isArray(dish.ingredients)
                        ? dish.ingredients.join(", ")
                        : dish.ingredients}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Euro className="w-4 h-4 text-orange-500 mr-1" />
                    <span className="font-bold text-orange-700">
                      €{dish.price}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-orange-50">
                  <Link
                    to={`/dish/${dish._id}`}
                    className="block w-full text-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    <Info className="inline-block mr-1" size={16} />
                    Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-orange-500 text-white rounded-l"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-orange-50 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-orange-500 text-white rounded-r"
          >
            Next
          </button>
        </div>
      </div>
      {/* </div> */}
    </animated.div>
  );
};

export default DishesPage;
