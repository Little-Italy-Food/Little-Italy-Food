import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { UserContext } from './usercontext';

const ChefProfile = () => {
  const { id } = useParams();
  const [chef, setChef] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { user, updateUser, loading: userLoading } = useContext(UserContext);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  useEffect(() => {
    const fetchChefAndDishes = async () => {
      try {
        const [chefResponse, dishesResponse] = await Promise.all([
          axios.get(`http://localhost:5001/api/chefs/${id}`),
          axios.get(`http://localhost:5001/api/dishes/${id}`)
        ]);
        setChef(chefResponse.data);
        setDishes(dishesResponse.data);
        setLoading(false);

        // Check if user is subscribed to this chef
        if (!userLoading && user && user.subscriptions && user.subscriptions.includes(id)) {
          setIsSubscribed(true);
        }
      } catch (err) {
        console.error('Error fetching chef details:', err);
        setError('Failed to fetch chef details. Please try again later.');
        setLoading(false);
      }
    };

    fetchChefAndDishes();
  }, [id, user, userLoading]);

  const handleSubscribe = async (details, data) => {
    try {
      const response = await axios.post('http://localhost:5001/api/subscriptions', {
        chefId: id,
        paypalOrderId: data.orderID
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      
      setIsSubscribed(true);
      updateUser(response.data.user);
      setShowSubscribeModal(false);
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  if (loading || userLoading) return <div className="text-center mt-10">Loading chef profile...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!chef) return <div className="text-center mt-10">Chef not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 via-white to-red-500 h-32"></div>
          <div className="p-8">
            <div className="relative -mt-16">
              <div className="bg-white rounded-full p-4 shadow-lg inline-block">
                <span className="text-6xl">{chef.username[0]}</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold mt-4 text-gray-800">{chef.username}</h1>
            <p className="text-gray-600 mt-2">Master Chef of Italian Cuisine</p>
            <div className="mt-4 flex items-center">
              {isSubscribed ? (
                <span className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Subscribed
                </span>
              ) : (
                <button
                  onClick={() => setShowSubscribeModal(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Subscribe
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Chef's dishes section */}
        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-800">Chef's Signature Dishes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {dishes.map((dish) => (
            <Link
              key={dish._id}
              to={`/dish/${dish._id}`}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105"
            >
              <div className="h-48 bg-gray-200">
                {dish.imageUrl ? (
                  <img src={dish.imageUrl} alt={dish.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <span className="text-4xl text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{dish.title}</h3>
                <p className="text-gray-600 mb-4">{dish.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-bold">${dish.price}</span>
                  <span className="text-sm text-gray-500">{dish.category}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Subscription Modal */}
      {showSubscribeModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Subscribe to {chef.username}</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Subscribe for $5.00 per month to get exclusive access to {chef.username}'s premium content.
                </p>
              </div>
              <div className="mt-4">
                <PayPalButtons
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [{
                        amount: {
                          value: "5.00" // Subscription price
                        }
                      }]
                    });
                  }}
                  onApprove={handleSubscribe}
                />
                <button
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 mt-3"
                  onClick={() => setShowSubscribeModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChefProfile;