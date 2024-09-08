import React, { useEffect, useState } from "react";
import axios from "axios";

const RecipeCards = () => {
  const [recipes, setRecipes] = useState([]); //لتخزين الوصفات
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/recipes/recipes-get")
      .then((response) => {
        setRecipes(response.data); //احدث الرسبي بلبيانات المستلمه
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
        setError("Error fetching recipes");
      });
  }, []);
  //يعرض البطاقات
  const RecipeCard = ({
    name,
    briefDescription,
    mainImage,
    chef,
    cookingTime,
  }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 transform hover:scale-105 flex flex-col">
      <img
        src={`http://localhost:5001/${mainImage}`}
        alt={name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">
          {briefDescription}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-sm text-gray-500">
            Chef: {chef ? chef.name : "Unknown"}
          </span>
          <span className="text-sm text-gray-500">
            {cookingTime.hours}h {cookingTime.minutes}m
          </span>
        </div>
        <button className="mt-4 bg-red-500 text-white py-2 px-4 rounded-full border-none cursor-pointer transition-colors duration-300 hover:bg-red-600">
          View Recipe
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="bg-gradient-to-br bg-[#ffffff] py-16 relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/premium-photo/painting-hamburger-salad-table_976492-49575.jpg?w=1060')", // ضع هنا رابط الصورة التي تريدها كخلفية
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
            Our Delicious Recipes
          </h2>
          <div className="w-24 h-1 bg-red-500 mx-auto"></div>
          <p className="mt-4 text-xl text-[#ffffff]">
            Explore our collection of authentic Italian dishes
          </p>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {recipes.slice(0, 3).map(
            (
              recipe // تحديد عرض 3 بطاقات فقط
            ) => (
              <RecipeCard key={recipe._id} {...recipe} />
            )
          )}
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <img
          src="/pasta-icon.svg"
          alt="Pasta"
          className="absolute top-10 left-10 w-20 h-20 opacity-10 transform rotate-12"
        />
        <img
          src="/pizza-icon.svg"
          alt="Pizza"
          className="absolute bottom-10 right-10 w-24 h-24 opacity-10 transform -rotate-12"
        />
        <img
          src="/tomato-icon.svg"
          alt="Tomato"
          className="absolute top-1/3 right-1/4 w-16 h-16 opacity-10"
        />
        <img
          src="/basil-icon.svg"
          alt="Basil"
          className="absolute bottom-1/4 left-1/3 w-12 h-12 opacity-10 transform rotate-45"
        />
      </div>
    </div>
  );
};

export default RecipeCards;
