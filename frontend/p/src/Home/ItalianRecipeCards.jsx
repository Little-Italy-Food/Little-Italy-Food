import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Clock, User, ChevronRight } from "lucide-react";
import M1 from "../assets/new/qq-removebg-preview.png";
import M2 from "../assets/new/cc-removebg-preview.png";
import M3 from "../assets/new/dd-removebg-preview.png";

const RecipeCard = ({
  name,
  briefDescription,
  mainImage,
  chef,
  cookingTime,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-3xl hover:scale-105"
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative">
        <img
          src={`http://localhost:5001/${mainImage}`}
          alt={name}
          className="w-full h-60 object-cover rounded-t-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
        <h3 className="absolute bottom-4 left-4 text-2xl font-extrabold text-white drop-shadow-lg">
          {name}
        </h3>
      </div>
      <div className="p-6 space-y-4">
        <p className="text-gray-600 text-sm mb-12 h-14 overflow-hidden">
          {briefDescription}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center">
            <User size={18} className="mr-2 text-gray-700" />
            <span>{chef ? chef.name : "Unknown Chef"}</span>
          </div>
          <div className="flex items-center">
            <Clock size={18} className="mr-2 text-gray-700" />
            <span>
              {cookingTime.hours}h {cookingTime.minutes}m
            </span>
          </div>
        </div>
        <motion.button
          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-full flex items-center justify-center shadow-lg transition-all ease-in-out"
          whileHover={{ scale: 1.05, backgroundColor: "#c53030" }}
          whileTap={{ scale: 0.95 }}
        >
          View Recipe
          <motion.div
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronRight size={22} className="ml-2" />
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  );
};

const RecipeCards = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/recipes/recipes-get")
      .then((response) => {
        setRecipes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
        setError("Error fetching recipes");
      });
  }, []);

  return (
    <div className="relative py-20 bg-gradient-to-b from-gray-100 via-white to-gray-200 overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-photo/juicy-cheeseburger-wooden-cutting-board_9975-24326.jpg?ga=GA1.1.130154526.1725818326&semt=ais_hybrid')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px)",
        }}
      />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            className="text-5xl font-extrabold text-gray-800 mb-6 drop-shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Culinary Masterpieces
          </motion.h2>
          <motion.div
            className="w-36 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto mb-8"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />
          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Embark on a gastronomic journey through our collection of authentic
            Italian recipes
          </motion.p>
        </div>

        {error && (
          <motion.p
            className="text-red-500 text-center mb-8 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}

        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, staggerChildren: 0.2, delayChildren: 1 }}
        >
          {recipes.slice(0, 3).map((recipe) => (
            <RecipeCard key={recipe._id} {...recipe} />
          ))}
        </motion.div>
      </div>

      {/* Floating Decorative Elements */}
      <motion.img
        src={M1}
        alt="Pasta"
        className="absolute top-12 left-12 w-52 h-52 opacity-30 transform rotate-12 animate-bounce"
        animate={{ rotate: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.img
        src={M2}
        alt="Pizza"
        className="absolute bottom-10 right-0 w-44 h-44 opacity-30 transform -rotate-12 animate-bounce delay-75"
        animate={{ rotate: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.img
        src={M3}
        alt="Tomato"
        className="absolute top-[15%] right-[25%] w-56 h-56 opacity-30 animate-bounce delay-100"
      />
    </div>
  );
};

export default RecipeCards;
