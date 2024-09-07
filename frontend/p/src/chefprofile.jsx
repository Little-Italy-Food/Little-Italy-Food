// import React, { useState, useEffect, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { PayPalButtons } from "@paypal/react-paypal-js";
// import { UserContext } from "./usercontext";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import RecipesChef from "./components/chef/RecipesChef";

// const ChefProfile = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [chef, setChef] = useState(null);
//   const [dishes, setDishes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const { user, updateUser, loading: userLoading } = useContext(UserContext);
//   const [showSubscribeModal, setShowSubscribeModal] = useState(false);
//   const [currentDishIndex, setCurrentDishIndex] = useState(0);

//   useEffect(() => {
//     const fetchChefAndDishes = async () => {
//       try {
//         const [chefResponse, dishesResponse] = await Promise.all([
//           axios.get(`http://localhost:5001/api/chefs/${id}`),
//           axios.get(`http://localhost:5001/api/dishes/${id}`),
//         ]);
//         setChef(chefResponse.data);
//         setDishes(dishesResponse.data);
//         setLoading(false);

//         if (
//           !userLoading &&
//           user &&
//           user.subscriptions &&
//           user.subscriptions.includes(id)
//         ) {
//           setIsSubscribed(true);
//         }
//       } catch (err) {
//         console.error("Error fetching chef details:", err);
//         setError("Failed to fetch chef details. Please try again later.");
//         setLoading(false);
//       }
//     };

//     fetchChefAndDishes();
//   }, [id, user, userLoading]);

//   const handleSubscribe = async (details, data) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:5001/api/subscriptions",
//         {
//           chefId: id,
//           paypalOrderId: data.orderID,
//         },
//         {
//           headers: { "x-auth-token": localStorage.getItem("token") },
//         }
//       );

//       setIsSubscribed(true);
//       updateUser(response.data.user);
//       setShowSubscribeModal(false);
//     } catch (error) {
//       console.error("Subscription error:", error);
//     }
//   };

//   const rotateDishes = (direction) => {
//     if (direction === "next") {
//       setCurrentDishIndex((prevIndex) => (prevIndex + 1) % dishes.length);
//     } else {
//       setCurrentDishIndex(
//         (prevIndex) => (prevIndex - 1 + dishes.length) % dishes.length
//       );
//     }
//   };

//   const navigateToDishDetails = () => {
//     const currentDish = dishes[currentDishIndex];
//     if (currentDish && currentDish._id) {
//       navigate(`/dish/${currentDish._id}`);
//     }
//   };

//   if (loading || userLoading)
//     return <div className="text-center mt-10">Loading chef profile...</div>;
//   if (error)
//     return <div className="text-center mt-10 text-red-500">{error}</div>;
//   if (!chef) return <div className="text-center mt-10">Chef not found</div>;

//   return (
//     <>
//       <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-white shadow-xl rounded-lg overflow-hidden">
//             <div className="bg-gradient-to-r from-green-500 via-white to-red-500 h-32"></div>
//             <div className="p-8">
//               <div className="relative -mt-16">
//                 <div className="bg-white rounded-full p-4 shadow-lg inline-block">
//                   <span className="text-6xl">{chef.username[0]}</span>
//                 </div>
//               </div>
//               <h1 className="text-4xl font-bold mt-4 text-gray-800">
//                 {chef.username}
//               </h1>
//               <p className="text-gray-600 mt-2">
//                 Master Chef of Italian Cuisine
//               </p>
//               <div className="mt-4 flex items-center">
//                 {isSubscribed ? (
//                   <span className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center">
//                     <svg
//                       className="w-5 h-5 mr-2"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M5 13l4 4L19 7"
//                       ></path>
//                     </svg>
//                     Subscribed
//                   </span>
//                 ) : (
//                   <button
//                     onClick={() => setShowSubscribeModal(true)}
//                     className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
//                   >
//                     Subscribe
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Chef's dishes section with new design */}
//           <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-800">
//             Chef's Signature Dishes
//           </h2>
//           <div className="flex items-center justify-between p-8 bg-[#FDF6F0] rounded-lg shadow-lg">
//             <div className="w-1/2">
//               <h2 className="text-4xl font-bold mb-2">
//                 ${dishes[currentDishIndex]?.price}
//               </h2>
//               <h3 className="text-2xl font-semibold mb-4">
//                 {dishes[currentDishIndex]?.title}
//               </h3>
//               <p className="text-gray-600 mb-6">
//                 {dishes[currentDishIndex]?.description}
//               </p>
//               <button
//                 className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
//                 onClick={navigateToDishDetails}
//               >
//                 Dish Details
//               </button>
//             </div>
//             <div className="w-1/2 relative">
//               <div className="w-[400px] h-[400px] mx-auto relative">
//                 <img
//                   src={
//                     dishes[currentDishIndex]?.imageUrl ||
//                     "/placeholder-image.jpg"
//                   }
//                   alt={dishes[currentDishIndex]?.title}
//                   className="w-64 h-64 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full object-cover shadow-lg"
//                 />
//                 {dishes.map((dish, index) => {
//                   const angle =
//                     ((index - currentDishIndex + dishes.length) %
//                       dishes.length) *
//                     ((2 * Math.PI) / dishes.length);
//                   const x = Math.cos(angle) * 180;
//                   const y = Math.sin(angle) * 180;
//                   return (
//                     <img
//                       key={index}
//                       src={dish.imageUrl || "/placeholder-image.jpg"}
//                       alt={dish.title}
//                       className={`w-20 h-20 rounded-full absolute object-cover transition-all duration-300 shadow-md ${
//                         index === currentDishIndex
//                           ? "opacity-0"
//                           : "opacity-70 hover:opacity-100 hover:scale-110"
//                       }`}
//                       style={{
//                         transform: `translate(${x}px, ${y}px)`,
//                         top: "calc(50% - 10px)",
//                         left: "calc(50% - 10px)",
//                       }}
//                     />
//                   );
//                 })}
//               </div>
//               <button
//                 onClick={() => rotateDishes("prev")}
//                 className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
//               >
//                 <ChevronLeft size={24} />
//               </button>
//               <button
//                 onClick={() => rotateDishes("next")}
//                 className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
//               >
//                 <ChevronRight size={24} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Subscription Modal */}
//         {showSubscribeModal && (
//           <div
//             className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
//             id="my-modal"
//           >
//             <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
//               <div className="mt-3 text-center">
//                 <h3 className="text-lg leading-6 font-medium text-gray-900">
//                   Subscribe to {chef.username}
//                 </h3>
//                 <div className="mt-2 px-7 py-3">
//                   <p className="text-sm text-gray-500">
//                     Subscribe for $5.00 per month to get exclusive access to{" "}
//                     {chef.username}'s premium content.
//                   </p>
//                 </div>
//                 <div className="mt-4">
//                   <PayPalButtons
//                     createOrder={(data, actions) => {
//                       return actions.order.create({
//                         purchase_units: [
//                           {
//                             amount: {
//                               value: "5.00", // Subscription price
//                             },
//                           },
//                         ],
//                       });
//                     }}
//                     onApprove={handleSubscribe}
//                   />
//                   <button
//                     className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 mt-3"
//                     onClick={() => setShowSubscribeModal(false)}
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       <RecipesChef id={id} />
//     </>
//   );
// };

// export default ChefProfile;
///////////////////////////////

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { UserContext } from "./usercontext";
import { motion, AnimatePresence } from "framer-motion";
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
  const [showFullImage, setShowFullImage] = useState(false);

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
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <h1 className="text-6xl font-bold text-red-500 mb-4">
                  Making you hungry
                </h1>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full inline-flex items-center mb-4">
                  <svg
                    className="w-4 h-4 mr-1"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
                  </svg>
                  Live Streaming
                </div>
                <p className="text-gray-800 mb-6 font-serif text-lg leading-relaxed">
                  <span className="text-green-600 font-bold">Food</span> is a
                  gift to be cherished, not wasted. Every dish tells a story,
                  and every ingredient has a purpose. Together, let's embrace
                  the{" "}
                  <span className="text-green-600 font-bold">
                    art of cooking
                  </span>{" "}
                  and make sure every plate makes a difference.
                </p>

                {/* <div className="flex space-x-4">Social media icons</div> */}
                <div className="flex space-x-4">
                  <a
                    href="https://www.instagram.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="w-6 h-6 text-gray-400 hover:text-pink-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>

                  <a
                    href="https://twitter.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="w-6 h-6 text-gray-400 hover:text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>

                  <a
                    href="https://www.facebook.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="w-6 h-6 text-gray-400 hover:text-blue-700"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  </a>

                  <a
                    href="https://wa.me/yourphonenumber"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="w-6 h-6 text-gray-400 hover:text-green-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="md:w-3/6 relative h-[450px]">
                <motion.img
                  src={chef.image}
                  alt={chef.username}
                  className="w-full h-full object-cover rounded-tl-[15rem] rounded-br-[15rem] rounded-tr-[5rem] rounded-bl-[5rem]"
                  onClick={() => setShowFullImage(true)}
                  whileHover={{ scale: 1.05 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h2 className="text-white text-3xl font-semibold">
                    {chef.username}
                  </h2>
                  <p className="text-gray-300 text-xl">
                    Master Chef of Italian Cuisine
                  </p>
                </div>
              </div>
            </div>
            {/* <div className="bg-gray-100 p-6">
            <h3 className="text-xl font-semibold mb-4">Featured Recipes</h3>
          </div> */}
          </div>

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
                className="bg-orange-500 hover:bg-amber-200 text-white font-bold py-2 px-4 rounded transition duration-300"
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
                  className="w-52 h-64 rounded-tl-[15rem] rounded-br-[12rem]  rounded-bl-[12rem] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  rounded-tr-[2rem] object-cover shadow-lg"
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
                      className={`w-20 h-20  rounded-tl-[15rem]  rounded-full absolute object-cover transition-all duration-300 shadow-md ${
                        index === currentDishIndex
                          ? "opacity-0"
                          : "opacity-70 hover:opacity-100 hover:scale-110"
                      }`}
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                        top: "calc(50% - 40px)",
                        left: "calc(50% - 40px)",
                      }}
                      onClick={() => setCurrentDishIndex(index)}
                    />
                  );
                })}
              </div>
              <button
                className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-100 rounded-full p-2 shadow-md"
                onClick={() => rotateDishes("prev")}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-100 rounded-full p-2 shadow-md"
                onClick={() => rotateDishes("next")}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
          </div>
        </div>

        {showSubscribeModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-[500px]">
              <h2 className="text-2xl font-semibold mb-4">
                Subscribe to Chef {chef.username}
              </h2>
              <p className="text-gray-600 mb-6">
                Support {chef.username} by subscribing and gain access to
                exclusive content.
              </p>
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: "10.00",
                        },
                      },
                    ],
                  });
                }}
                onApprove={handleSubscribe}
              />
              <button
                className="mt-4 text-red-500 font-semibold"
                onClick={() => setShowSubscribeModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <RecipesChef id={id} />
    </>
  );
};

export default ChefProfile;
