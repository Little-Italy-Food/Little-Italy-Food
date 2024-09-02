import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Pizza, Euro, Info } from 'lucide-react';

const DishesPage = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/dishescategory');
        setDishes(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching dishes. Please try again later.');
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading dishes...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 via-white to-red-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-green-700 font-serif">Piatti Deliziosi</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishes.map(dish => (
            <div key={dish._id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-green-200">
              <div className="w-full h-48 relative">
                <img src={dish.imageUrl || "/api/placeholder/400/300"} alt={dish.title} className="w-full h-full object-cover" />
                <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 m-2 rounded-full text-sm font-bold">
                  {dish.category}
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 text-red-700 font-serif">{dish.title}</h2>
                <p className="text-gray-600 mb-2 italic">{dish.description}</p>
              </div>
              <div className="bg-gray-50 p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <Pizza className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-600">{dish.ingredients}</span>
                </div>
                <div className="flex items-center">
                  <Euro className="w-5 h-5 text-green-500 mr-1" />
                  <span className="font-bold text-green-700">{dish.price}</span>
                </div>
              </div>
              <div className="p-4 bg-green-50">
                <Link 
                  to={`/dish/${dish._id}`} 
                  className="block w-full text-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                >
                  <Info className="inline-block mr-2" size={18} />
                  Dish details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DishesPage;