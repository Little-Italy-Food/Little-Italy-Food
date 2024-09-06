import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { UserContext } from "./usercontext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import RecipesChef from "./components/chef/RecipesChef";

const ChefProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chef, setChef] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { user, updateUser, loading: userLoading } = useContext(UserContext);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [currentDishIndex, setCurrentDishIndex] = useState(0);

  useEffect(() => {
    const fetchChefAndDishes = async () => {
      try {
        const [chefResponse, dishesResponse] = await Promise.all([
          axios.get(`http://localhost:5001/api/chefs/${id}`),
          axios.get(`http://localhost:5001/api/dishes/${id}`),
        ]);
        setChef(chefResponse.data);
        setDishes(dishesResponse.data);
        setLoading(false);

        if (
          !userLoading &&
          user &&
          user.subscriptions &&
          user.subscriptions.includes(id)
        ) {
          setIsSubscribed(true);
        }
      } catch (err) {
        console.error("Error fetching chef details:", err);
        setError("Failed to fetch chef details. Please try again later.");
        setLoading(false);
      }
    };

    fetchChefAndDishes();
  }, [id, user, userLoading]);

  const handleSubscribe = async (details, data) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/subscriptions",
        {
          chefId: id,
          paypalOrderId: data.orderID,
        },
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );

      setIsSubscribed(true);
      updateUser(response.data.user);
      setShowSubscribeModal(false);
    } catch (error) {
      console.error("Subscription error:", error);
    }
  };

  const rotateDishes = (direction) => {
    if (direction === "next") {
      setCurrentDishIndex((prevIndex) => (prevIndex + 1) % dishes.length);
    } else {
      setCurrentDishIndex(
        (prevIndex) => (prevIndex - 1 + dishes.length) % dishes.length
      );
    }
  };

  const navigateToDishDetails = () => {
    const currentDish = dishes[currentDishIndex];
    if (currentDish && currentDish._id) {
      navigate(`/dish/${currentDish._id}`);
    }
  };

  if (loading || userLoading)
    return <div className="text-center mt-10">Loading chef profile...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!chef) return <div className="text-center mt-10">Chef not found</div>;

  return (
    <>
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
              <h1 className="text-4xl font-bold mt-4 text-gray-800">
                {chef.username}
              </h1>
              <p className="text-gray-600 mt-2">
                Master Chef of Italian Cuisine
              </p>
              <div className="mt-4 flex items-center">
                {isSubscribed ? (
                  <span className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
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

          {/* Chef's dishes section with new design */}
          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-800">
            Chef's Signature Dishes
          </h2>
          <div className="flex items-center justify-between p-8 bg-[#FDF6F0] rounded-lg shadow-lg">
            <div className="w-1/2">
              <h2 className="text-4xl font-bold mb-2">
                ${dishes[currentDishIndex]?.price}
              </h2>
              <h3 className="text-2xl font-semibold mb-4">
                {dishes[currentDishIndex]?.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {dishes[currentDishIndex]?.description}
              </p>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                onClick={navigateToDishDetails}
              >
                Dish Details
              </button>
            </div>
            <div className="w-1/2 relative">
              <div className="w-[400px] h-[400px] mx-auto relative">
                <img
                  src={
                    dishes[currentDishIndex]?.imageUrl ||
                    "/placeholder-image.jpg"
                  }
                  alt={dishes[currentDishIndex]?.title}
                  className="w-64 h-64 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full object-cover shadow-lg"
                />
                {dishes.map((dish, index) => {
                  const angle =
                    ((index - currentDishIndex + dishes.length) %
                      dishes.length) *
                    ((2 * Math.PI) / dishes.length);
                  const x = Math.cos(angle) * 180;
                  const y = Math.sin(angle) * 180;
                  return (
                    <img
                      key={index}
                      src={dish.imageUrl || "/placeholder-image.jpg"}
                      alt={dish.title}
                      className={`w-20 h-20 rounded-full absolute object-cover transition-all duration-300 shadow-md ${
                        index === currentDishIndex
                          ? "opacity-0"
                          : "opacity-70 hover:opacity-100 hover:scale-110"
                      }`}
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                        top: "calc(50% - 10px)",
                        left: "calc(50% - 10px)",
                      }}
                    />
                  );
                })}
              </div>
              <button
                onClick={() => rotateDishes("prev")}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => rotateDishes("next")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Subscription Modal */}
        {showSubscribeModal && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
            id="my-modal"
          >
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Subscribe to {chef.username}
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Subscribe for $5.00 per month to get exclusive access to{" "}
                    {chef.username}'s premium content.
                  </p>
                </div>
                <div className="mt-4">
                  <PayPalButtons
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: "5.00", // Subscription price
                            },
                          },
                        ],
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
      <RecipesChef id={id} />
    </>
  );
};

export default ChefProfile;
