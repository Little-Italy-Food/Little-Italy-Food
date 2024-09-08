import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div className="container mx-auto px-16 py-8">
      <h1 className="text-4xl font-bold text-center mb-10 ">
        Explore Our Menu
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-4">
        {menuItems.slice(0, 8).map((item) => (
          <div key={item._id} className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-2">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="mt-2 text-lg text-gray-700">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuExplorer;
