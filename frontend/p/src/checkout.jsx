// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
// import { CartContext } from '../src/cartcontext';

// const Checkout = () => {
//   const [discountCode, setDiscountCode] = useState('');
//   const [discount, setDiscount] = useState(0);
//   const [total, setTotal] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const { cart, clearCart } = useContext(CartContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const newTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
//     setTotal(newTotal - discount);
//   }, [cart, discount]);

//   const handleDiscountCode = async () => {
//     setIsLoading(true);
//     setError('');
//     try {
//       const response = await axios.post('http://localhost:5001/api/validate-discount', { code: discountCode });
//       setDiscount(response.data.discount);
//     } catch (err) {
//       setError('Invalid discount code');
//       setDiscount(0);
//     }
//     setIsLoading(false);
//   };

//   const createOrder = (data, actions) => {
//     return actions.order.create({
//       purchase_units: [
//         {
//           amount: {
//             value: (total - discount).toFixed(2),
//           },
//         },
//       ],
//     });
//   };

//   const onApprove = async (data, actions) => {
//     const order = await actions.order.capture();
//     try {
//       const token = localStorage.getItem('token');
      
//       if (!token) {
//         throw new Error('No authentication token found');
//       }

//       const itemsWithChef = cart.map(item => ({
//         ...item,
//         chefId: item.chefId || 'default-chef-id' // Replace with actual chef ID if not present
//       }));

//       const response = await axios.post('http://localhost:5001/api/orders', {
//         paypalOrderId: order.id,
//         items: itemsWithChef,
//         totalAmount: total - discount,
//         discountCode: discountCode
//       }, {
//         headers: {
//           'x-auth-token': token
//         }
//       });

//       clearCart();
//       navigate('/order-confirmation', { state: { orderId: response.data.orderId } });
//     } catch (err) {
//       console.error('Error creating order:', err);
//       setError('Failed to create order. Please try again.');
//     }
//   };

//   return (
//     <div className="container mx-auto mt-10">
//       <h1 className="text-3xl font-bold mb-6">Checkout</h1>
//       <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
//         <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
//         {cart.map((item) => (
//           <div key={item._id} className="flex justify-between mb-2">
//             <span>{item.title} x {item.quantity}</span>
//             <span>${(item.price * item.quantity).toFixed(2)}</span>
//           </div>
//         ))}
//         <div className="border-t border-gray-200 mt-4 pt-4">
//           <div className="flex justify-between mb-2">
//             <span>Subtotal:</span>
//             <span>${total.toFixed(2)}</span>
//           </div>
//           {discount > 0 && (
//             <div className="flex justify-between mb-2 text-green-600">
//               <span>Discount:</span>
//               <span>-${discount.toFixed(2)}</span>
//             </div>
//           )}
//           <div className="flex justify-between font-bold">
//             <span>Total:</span>
//             <span>${(total - discount).toFixed(2)}</span>
//           </div>
//         </div>
//         <div className="mt-6">
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="discountCode">
//             Discount Code
//           </label>
//           <div className="flex">
//             <input
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               id="discountCode"
//               type="text"
//               placeholder="Enter discount code"
//               value={discountCode}
//               onChange={(e) => setDiscountCode(e.target.value)}
//             />
//             <button
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
//               onClick={handleDiscountCode}
//               disabled={isLoading}
//             >
//               Apply
//             </button>
//           </div>
//           {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
//         </div>
//         <div className="mt-6">
//           <PayPalScriptProvider options={{ "client-id": "AV02eqe3RJg8sU_mXlo8dKbod7dEscG1WCzeN-tc-qV5eYN9WupElGxlJ4rKtGoYMK9BwbOlOdT34Wb1" }}>
//             <PayPalButtons 
//               createOrder={createOrder}
//               onApprove={onApprove}
//               style={{ layout: "horizontal" }}
//             />
//           </PayPalScriptProvider>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { CartContext } from "../src/cartcontext";
import { motion } from "framer-motion";

const Checkout = () => {
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const newTotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(newTotal - discount);
  }, [cart, discount]);

  const handleDiscountCode = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5001/api/validate-discount",
        { code: discountCode }
      );
      setDiscount(response.data.discount);
    } catch (err) {
      setError("Invalid discount code");
      setDiscount(0);
    }
    setIsLoading(false);
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: (total - discount).toFixed(2),
          },
        },
      ],
    });
  };

  const onApprove = async (data, actions) => {
    const order = await actions.order.capture();
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const itemsWithChef = cart.map((item) => ({
        ...item,
        chefId: item.chefId || "default-chef-id",
      }));

      const response = await axios.post(
        "http://localhost:5001/api/orders",
        {
          paypalOrderId: order.id,
          items: itemsWithChef,
          totalAmount: total - discount,
          discountCode: discountCode,
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      clearCart();
      navigate("/order-confirmation", {
        state: { orderId: response.data.orderId },
      });
    } catch (err) {
      console.error("Error creating order:", err);
      setError("Failed to create order. Please try again.");
    }
  };

  return (
    <motion.div
      className="container mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800 text-center">
        Checkout
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Order Summary
        </h2>
        {cart.map((item) => (
          <motion.div
            key={item._id}
            className="flex items-center justify-between mb-4 border-b pb-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-16 h-16 object-cover rounded-lg shadow-md"
            />
            <span className="text-lg font-medium text-gray-700">
              {item.title} x {item.quantity}
            </span>
            <span className="text-lg font-medium text-green-700">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </motion.div>
        ))}

        <div className="border-t border-gray-300 mt-4 pt-4">
          <div className="flex justify-between mb-2 text-lg">
            <span className="font-medium">Subtotal:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between mb-2 text-lg text-green-600">
              <span className="font-medium">Discount:</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold">
            <span>Total:</span>
            <span className="text-red-600">
              ${(total - discount).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="discountCode"
          >
            Discount Code
          </label>
          <div className="flex">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="discountCode"
              type="text"
              placeholder="Enter discount code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
              onClick={handleDiscountCode}
              disabled={isLoading}
            >
              Apply
            </button>
          </div>
          {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
        </div>

        <div className="mt-6">
          <PayPalScriptProvider
            options={{
              "client-id":
                "AV02eqe3RJg8sU_mXlo8dKbod7dEscG1WCzeN-tc-qV5eYN9WupElGxlJ4rKtGoYMK9BwbOlOdT34Wb1",
            }}
          >
            <PayPalButtons
              createOrder={createOrder}
              onApprove={onApprove}
              style={{ layout: "horizontal" }}
            />
          </PayPalScriptProvider>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;