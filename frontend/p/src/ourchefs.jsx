// import React, { useState, useEffect } from "react";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";
// import Navbar from "./navbar";

// const OurChefs = () => {
//   const [chefs, setChefs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchChefs = async () => {
//       try {
//         const response = await axios.get("http://localhost:5001/api/chefs");
//         setChefs(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to fetch chefs. Please try again later.");
//         setLoading(false);
//       }
//     };

//     fetchChefs();
//   }, []);

//   if (loading) return <div className="text-center mt-10">Loading chefs...</div>;
//   if (error)
//     return <div className="text-center mt-10 text-red-500">{error}</div>;

//   return (
//     <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
//       <Navbar></Navbar>
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
//           Our <span className="text-green-600">Talented</span> Chefs
//         </h1>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {chefs.map((chef) => (
//             <Link
//               key={chef._id}
//               to={`/chef/${chef._id}`}
//               className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105"
//             >
//               <div className="h-48 bg-gray-200">
//                 <div className="h-full flex items-center justify-center">
//                   <span className="text-6xl text-gray-400">
//                     {chef.username[0]}
//                   </span>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <h2 className="text-2xl font-bold mb-2 text-gray-800">
//                   {chef.username}
//                 </h2>
//                 <p className="text-gray-600">Master of Italian Cuisine</p>
//               </div>
//               <div className="px-6 py-4">
//                 <div className="inline-block bg-green-500 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2">
//                   #pasta
//                 </div>
//                 <div className="inline-block bg-red-500 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2">
//                   #pizza
//                 </div>
//                 <div className="inline-block bg-white border border-green-500 rounded-full px-3 py-1 text-sm font-semibold text-green-500">
//                   #italian
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OurChefs;
//////////////////////

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const OurChefs = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/chefs");
        setChefs(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch chefs. Please try again later.");
        setLoading(false);
      }
    };

    fetchChefs();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading chefs...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Our <span className="text-green-600">Talented</span> Chefs
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {chefs.map((chef) => (
            <Link
              key={chef._id}
              to={`/chef/${chef._id}`}
              className="group relative cursor-pointer overflow-hidden rounded-lg shadow-lg transition-shadow hover:shadow-xl hover:shadow-black/30"
            >
              <div className="h-96 w-full">
                <img
                  src={chef.image}
                  alt={chef.username}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:rotate-3 group-hover:scale-125"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black group-hover:from-black/70 group-hover:via-black/60 group-hover:to-black/70"></div>
              <div className="absolute inset-0 flex translate-y-[60%] flex-col items-center justify-center px-9 text-center transition-all duration-500 group-hover:translate-y-0">
                <h2 className="font-dmserif text-3xl font-bold text-white mb-2">
                  {chef.username}
                </h2>
                <p className="text-lg italic text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Master of Italian Cuisine
                </p>
                <div className="mt-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="inline-block bg-green-500 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2">
                    #pasta
                  </span>
                  <span className="inline-block bg-red-500 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2">
                    #pizza
                  </span>
                  <span className="inline-block bg-white border border-green-500 rounded-full px-3 py-1 text-sm font-semibold text-green-500">
                    #italian
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurChefs;
