import React, { useEffect, useState } from "react";
import axios from "axios";
import { Utensils, Star, DollarSign } from "lucide-react";

const MenuExplorer = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/dishescategory"
        );
        setMenuItems(response.data);
      } catch (error) {
        console.error("Error fetching dishes:", error);
      }
    };

    fetchDishes();
  }, []);

  return (
    <div className="container mx-auto lg:px-44 py-12 bg-gray-50">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800 flex items-center justify-center">
        <Utensils className="mr-4" size={36} />
        Explore Our Menu
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        {menuItems.slice(0, 8).map((item) => (
          <div
            key={item._id}
            className="relative flex flex-col items-center bg-gradient-to-b from-blue-50 to-white p-6 rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-orange-200 via-transparent to-transparent opacity-40"></div>
            <div className="relative z-10 w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-orange-500">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800">{item.title}</h3>
              {/* <p className="mt-1 text-gray-600">{item.description}</p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuExplorer;
