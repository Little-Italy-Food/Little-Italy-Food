import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ItalianDishCards = () => {
  const [dishes, setDishes] = useState([]); //APIتخزين الأطباق المسترجعة من الـ
  const [error, setError] = useState(null); //لإدارة الخطأ
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/dishescategory")
      .then((response) => {
        setDishes(response.data.slice(0, 4));
      })
      .catch((error) => {
        console.error("Error fetching dishes:", error);
        setError("Error fetching dishes");
      });
  }, []);

  const DishCard = (
    { _id, title, description, price, imageUrl } //هاذ يعرض الكاردات وتجي من لتحت
  ) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 transform hover:scale-105 flex flex-col">
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-lg font-bold text-green-600">
            ${parseFloat(price).toFixed(2)}
          </span>
          <button
            onClick={() => navigate(`/dish/${_id}`)} // اضغط هنا لتوجيه المستخدم إلى صفحة التفاصيل
            className="bg-red-500 text-white py-2 px-4 rounded-full border-none cursor-pointer transition-colors duration-300 hover:bg-red-600"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 py-16 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Our Signature Italian Dishes
          </h2>
          <div className="w-24 h-1 bg-red-500 mx-auto"></div>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {dishes.map(
            (
              dish //يمرر البيانات من خلال الماب لتنعرض من خلال الفرعي الفوق
            ) => (
              <DishCard key={dish._id} {...dish} />
            )
          )}
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 border-4 border-red-500 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 border-4 border-green-500 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-4 border-yellow-500 rounded-full"></div>
      </div>
    </div>
  );
};

export default ItalianDishCards;
