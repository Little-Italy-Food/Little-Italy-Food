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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Explore Our Menu</h1>
      <p className="text-gray-600 mb-8">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla,
        exercitationem excepturi temporibus obcaecati voluptas vitae?
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
        {menuItems.map((item) => (
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
