import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCartPlus,
  FaUserCircle,
  FaBell,
  FaTimes,
  FaPlus,
  FaMinus,
  FaTrashAlt,
  FaBars,
} from "react-icons/fa";
import { CartContext } from "../src/cartcontext";
import logo from "../src/assets/logo(2).png";
import axios from "axios";

import Cart from "./assets/new/cart.png";
import Bill from "./assets/new/bell.png";
import User from "./assets/new/user (1).png";

const Navbar = () => {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } =
    useContext(CartContext);
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [isChef, setIsChef] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token && userId) {
      setUser({ id: userId });

      const fetchUserInfo = async () => {
        try {
          // First, try to fetch chef data
          const chefResponse = await axios.get(
            `http://localhost:5001/api/chefs/${userId}`
          );
          if (chefResponse.data) {
            setIsChef(true);
            setProfileImage(chefResponse.data.image || "");
          } else {
            // If not a chef, fetch regular user data
            const userResponse = await axios.get(
              `http://localhost:5001/api/users/${userId}`,
              {
                headers: { "x-auth-token": token },
              }
            );
            setIsChef(false);
            // Make sure to set the profile image for regular users as well
            setProfileImage(userResponse.data.image || "");
          }
        } catch (error) {
          // If chef fetch fails, try fetching user data
          try {
            const userResponse = await axios.get(
              `http://localhost:5001/api/userprofile/${userId}`,
              {
                headers: { "x-auth-token": token },
              }
            );
            setIsChef(false);
            setProfileImage(userResponse.data.image || "");
          } catch (userError) {
            console.error("Error fetching user info:", userError);
          }
        }
      };

      fetchUserInfo();
    }

    const fetchNotifications = async () => {
      if (!token) return;

      try {
        const response = await axios.get(
          "http://localhost:5001/api/notifications",
          {
            headers: { "x-auth-token": token },
          }
        );
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async (notification) => {
    try {
      await axios.put(
        `http://localhost:5001/api/notifications/${notification._id}`,
        { isRead: true },
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      const dishId = notification.dishId._id || notification.dishId;
      navigate(`/dish/${dishId}`);
      setShowNotifications(false);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
    setProfileImage("");
    setIsChef(false);
    setShowProfileMenu(false);
    navigate("/login");
  };

  const handleProfileClick = () => {
    setShowProfileMenu(false);
    if (isChef) {
      navigate("/chef/info");
    } else {
      navigate("/userprofile");
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-[85rem] mx-auto">
        <div className="flex items-center justify-between -px-10 py-2">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Logo" className="h-20 w-35" />
            </Link>
          </div>
          <div className="hidden md:flex flex-grow items-center justify-center space-x-4">
            <Link
              to="/recipes"
              className="py-4 px-2 text-gray-500 hover:text-orange-500 transition duration-300"
            >
              Recipe
            </Link>
            <Link
              to="/recipe-finder"
              className="py-4 px-2 text-gray-500 hover:text-orange-500 transition duration-300"
            >
              Discover Recipes
            </Link>
            <Link
              to="/substitute-finder"
              className="py-4 px-2 text-gray-500 hover:text-orange-500 transition duration-300"
            >
              Ingredient Swap
            </Link>
            <Link
              to="/ourchefs"
              className="py-4 px-2 text-gray-500 hover:text-orange-500 transition duration-300"
            >
              OurChefs
            </Link>
            <Link
              to="/dishespage"
              className="py-4 px-2 text-gray-500 hover:text-orange-500 transition duration-300"
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="py-4 px-2 text-gray-500 hover:text-orange-500 transition duration-300"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="py-4 px-2 text-gray-500 hover:text-orange-500 transition duration-300"
            >
              Contact
            </Link>{" "}
            <a
              href="http://localhost:5174/"
              target="blank"
              className="py-4 px-2 text-gray-500 hover:text-orange-500 transition duration-300"
            >
              Community
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative py-2 px-2 font-medium text-gray-500 rounded hover:bg-orange-200 hover:rounded-full hover:text-white transition duration-300"
            >
              <img src={Cart} alt="" className="inline-block text-xl w-9 h-9" />
              {/* <FaCartPlus  /> */}
              {itemCount > 0 && (
                <span className="ml-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                  {itemCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative py-2 px-2 font-medium text-gray-500 rounded hover:bg-orange-200 hover:rounded-full hover:text-white transition duration-300"
                >
                  <img
                    src={Bill}
                    alt=""
                    className="inline-block text-xl w-9 h-9"
                  />
                  {notifications.some((n) => !n.isRead) && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-2 h-2"></span>
                  )}
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
                          {notification.senderId.username} shared a dish with
                          you
                        </a>
                      ))
                    ) : (
                      <span className="block px-4 py-2 text-sm text-gray-700">
                        No notifications
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300"
              >
                Log In
              </Link>
            )}

            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="relative py-2 px-2 font-medium text-gray-500 rounded hover:bg-orange-200 hover:rounded-full hover:text-white transition duration-300"
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <img
                      src={User}
                      alt=""
                      className="inline-block text-xl w-9 h-9"
                    />
                  )}
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                    <button
                      onClick={handleProfileClick}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <Link to="SavedRecipe">
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Saved Recipe
                      </button>{" "}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
              onClick={() => setShowMenu(!showMenu)}
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {showMenu && (
        <div className="md:hidden bg-white shadow-lg">
          <Link
            to="/about-us"
            className="block py-2 px-4 text-gray-500 hover:bg-gray-100"
            onClick={() => setShowMenu(false)}
          >
            About
          </Link>
          <Link
            to="/shop"
            className="block py-2 px-4 text-gray-500 hover:bg-gray-100"
            onClick={() => setShowMenu(false)}
          >
            Shop
          </Link>
          <Link
            to="/contacts"
            className="block py-2 px-4 text-gray-500 hover:bg-gray-100"
            onClick={() => setShowMenu(false)}
          >
            Contact
          </Link>
          {user && (
            <>
              <button
                onClick={() => {
                  handleProfileClick();
                  setShowMenu(false);
                }}
                className="block w-full text-left py-2 px-4 text-gray-500 hover:bg-gray-100"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setShowMenu(false);
                }}
                className="block w-full text-left py-2 px-4 text-gray-500 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform ${
          showCart ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Your Cart</h2>
          <button onClick={() => setShowCart(false)}>
            <FaTimes className="text-xl" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between mb-4 items-center"
              >
                <div className="flex items-center">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium">{item.title}</h4>
                    <p className="text-xs text-gray-500">
                      Price: ${item.price}
                    </p>
                    <div className="flex items-center mt-2">
                      {/* Quantity controls */}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium">
                    ${item.price * item.quantity}
                  </span>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="ml-3 text-red-500 hover:text-red-700"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          )}
        </div>
        {cart.length > 0 && (
          <div className="p-4 border-t">
            <Link
              to="/cart"
              className="block w-full bg-gray-300 text-center text-black py-2 rounded-lg mb-2"
              onClick={() => setShowCart(false)}
            >
              Go to Cart
            </Link>
            <Link
              to="/checkout"
              className="block w-full bg-green-500 text-center text-white py-2 rounded-lg"
              onClick={() => setShowCart(false)}
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
