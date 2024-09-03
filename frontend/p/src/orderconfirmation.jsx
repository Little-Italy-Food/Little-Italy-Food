import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const OrderConfirmation = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const orderId = location.state?.orderId;

  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? 'N/A' : numPrice.toFixed(2);
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('No order ID provided');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5001/api/orders/${orderId}`, {
          headers: {
            'x-auth-token': token
          }
        });

        console.log('Full API response:', JSON.stringify(response.data, null, 2));
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order details:', err.response ? err.response.data : err.message);
        setError(`Failed to fetch order details: ${err.response ? err.response.data.msg : err.message}`);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <div className="text-center mt-10">Loading order details...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!order) return <div className="text-center mt-10">No order found</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-green-500 via-white to-red-500">
            <h1 className="text-4xl font-bold text-gray-800 text-center">Order Confirmation</h1>
          </div>
          <div className="p-6">
            <div className="mb-6 text-center">
              <p className="text-xl text-gray-700">Thank you for your order!</p>
              <p className="text-md text-gray-600">Order ID: <span className="font-semibold">{order._id}</span></p>
              <p className="text-md text-gray-600">Order Date: <span className="font-semibold">{new Date(order.orderDate).toLocaleString()}</span></p>
            </div>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b-2 border-green-500 pb-2">Order Details</h2>
              <div className="space-y-4">
                {Array.isArray(order.dishId) ? order.dishId.map((dish, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={dish.imageUrl || "/placeholder-image.jpg"} 
                        alt={dish.title} 
                        className="w-20 h-20 object-cover rounded-full border-2 border-green-500"
                      />
                      <span className="font-medium text-lg">{dish.title || 'Unknown Dish'}</span>
                    </div>
                    <span className="font-bold text-xl text-green-600">
                        ${formatPrice(dish.price)}
                   </span>
                  </div>
                )) : <p>No dish information available</p>}
              </div>
              <div className="flex justify-between items-center mt-6 bg-gray-100 p-4 rounded-lg">
                <span className="text-xl font-semibold">Total Amount:</span>
                <span className="text-2xl font-bold text-green-600">${order.totalAmount.toFixed(2)}</span>
              </div>
              {order.discountCode && (
                <div className="mt-4 bg-green-100 text-green-800 p-3 rounded-lg">
                  <span className="font-semibold">Discount Code Applied:</span> {order.discountCode}
                </div>
              )}
            </div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800 border-b-2 border-red-500 pb-2">Order Status</h2>
              <p className="text-lg capitalize bg-yellow-100 text-yellow-800 p-2 rounded-lg inline-block">{order.status}</p>
            </div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800 border-b-2 border-green-500 pb-2">Chef </h2>
              <p className="text-lg bg-blue-100 text-blue-800 p-2 rounded-lg inline-block">
                {order.chefId && order.chefId.username ? order.chefId.username : 'Chef information not available'}
              </p>
            </div>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800 border-b-2 border-red-500 pb-2">Payment Information</h2>
              <p className="text-lg">PayPal Order ID: <span className="font-medium">{order.paypalOrderId}</span></p>
            </div>
            <div className="text-center">
              <Link 
                to="/dishespage" 
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6  inline-block transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;