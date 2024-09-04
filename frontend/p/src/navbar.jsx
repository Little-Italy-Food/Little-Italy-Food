import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCartPlus, FaUserCircle, FaBell } from "react-icons/fa";
import { CartContext } from "../src/cartcontext";
import logo from "../src/assets/logo.png";
import axios from 'axios';

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      setUser({ id: userId });
    }

    const fetchNotifications = async () => {
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:5001/api/notifications', {
          headers: { 'x-auth-token': token }
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    // Set up polling to check for new notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async (notification) => {
    try {
      await axios.put(`http://localhost:5001/api/notifications/${notification._id}`, {
        isRead: true
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      const dishId = notification.dishId._id || notification.dishId;
      navigate(`/dish/${dishId}`);
      setShowNotifications(false);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <Link to="/" className="flex items-center py-4 px-2">
              <img src={logo} alt="Logo" className="h-8 w-8 mr-2" />
              <span className="font-semibold text-gray-500 text-lg">Little Italy</span>
            </Link>
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/about-us" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">About</Link>
              <Link to="/shop" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">Shop</Link>
              <Link to="/contacts" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">Contact</Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/cart" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300">
              <FaCartPlus className="inline-block text-xl" />
              {itemCount > 0 && <span className="ml-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs">{itemCount}</span>}
            </Link>
            {user ? (
              <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300">
                  <FaBell className="inline-block text-xl" />
                  {notifications.some(n => !n.isRead) && <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-2 h-2"></span>}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <a
                          key={notification._id}
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={(e) => {
                            e.preventDefault();
                            handleNotificationClick(notification);
                          }}
                        >
                          {notification.senderId.username} shared a dish with you
                        </a>
                      ))
                    ) : (
                      <span className="block px-4 py-2 text-sm text-gray-700">No notifications</span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300">
                Log In
              </Link>
            )}
            {user && (
              <div className="relative group">
                <button className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300">
                  <FaUserCircle className="inline-block text-xl" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10 hidden group-hover:block">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;