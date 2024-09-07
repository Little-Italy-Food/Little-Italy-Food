



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const ItalianDishCards = () => {
//   const [dishes, setDishes] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     axios.get('http://localhost:5001/api/dishescategory')
//       .then((response) => {
//         setDishes(response.data.slice(0, 4)); // يعرض  4 بطاقات 
//       })
//       .catch((error) => {
//         console.error('Error fetching dishes:', error);
//         setError('Error fetching dishes');
//       });
//   }, []);

//   const DishCard = ({ title, description, price, imageUrl }) => (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 transform hover:scale-105">
//       <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
//       <div className="p-4">
//         <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
//         <p className="text-gray-600 text-sm mb-4">{description}</p>
//         <div className="flex justify-between items-center">
//           <span className="text-lg font-bold text-green-600">${parseFloat(price).toFixed(2)}</span>
//           <button className="bg-red-500 text-white py-2 px-4 rounded-full border-none cursor-pointer transition-colors duration-300 hover:bg-red-600">
//             Order Now
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="max-w-6xl mx-auto p-8">
//       <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Our Signature Italian Dishes</h2>
//       {error && <p className="text-red-500 text-center mb-4">{error}</p>}
//       <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
//         {dishes.map((dish) => (
//           <DishCard key={dish._id} {...dish} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ItalianDishCards;
