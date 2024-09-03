import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaCartPlus, FaUserCircle } from "react-icons/fa";
import { CartContext } from "../src/cartcontext";
import logo from "../src/assets/logo.png";

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const customFontStyle = {
    fontFamily: "Georgia, serif",
  };

  return (
    <nav className="bg-transparent py-4 px-6 flex justify-between items-center border-b border-gray-200">
      <Link to="/" className="flex items-center space-x-4">
        <img
          src={logo}
          alt="Italy Food Shop"
          id="logo"
          className="h-16"
        />
      </Link>
      <div
        className="flex space-x-6 text-lg font-semibold"
        style={customFontStyle}
      >
        <Link to="/about-us" className="text-green-600 hover:text-green-800">
          About Us
        </Link>
        <Link to="/shop" className="text-green-600 hover:text-green-800">
          Shop
        </Link>
        <Link to="/deals" className="text-green-600 hover:text-green-800">
          Deals
        </Link>
        <Link to="/recipes-and-news" className="text-green-600 hover:text-green-800">
          Recipes and News
        </Link>
        <Link to="/contacts" className="text-green-600 hover:text-green-800">
          Contacts
        </Link>
      </div>
      <div className="flex items-center space-x-6">
        <Link
          to="/cart"
          className="text-green-600 hover:text-green-800 text-2xl relative"
        >
          <FaCartPlus />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {itemCount}
            </span>
          )}
        </Link>
        <Link
          to="/sign-in"
          className="text-green-600 hover:text-green-800 font-medium"
        >
          Sign In
        </Link>
        <Link
          to="/profile"
          className="text-green-600 hover:text-green-800 text-2xl"
        >
          <FaUserCircle />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;