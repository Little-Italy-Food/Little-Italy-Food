import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Edit2, Save, ShoppingBag } from "lucide-react";
import backgroundImage from "../src/assets/profilePic.jpg";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    image: "",
  });
  const [imageUrl, setImageUrl] = useState("");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchUserProfile(userId);
    }
  }, []);

  const fetchUserProfile = (userId) => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:5001/api/userprofile/${userId}`, {
        headers: { "x-auth-token": token }
      })
      .then((response) => {
        setProfile(response.data);
        setImageUrl(response.data.image);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user profile. Please try again.");
      });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const updatedProfile = { ...profile, image: imageUrl };
    axios
      .put(
        `http://localhost:5001/api/userprofile/${userId}`,
        updatedProfile,
        { headers: { "x-auth-token": token } }
      )
      .then((response) => {
        setIsEditing(false);
        setProfile(response.data);
        console.log("Profile updated successfully", response.data);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        setError("Failed to update profile. Please try again.");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  const fetchOrders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in again.");
      return;
    }

    setLoadingOrders(true);
    axios
      .get(`http://localhost:5001/api/userprofile/orders/user`, {
        headers: { "x-auth-token": token },
      })
      .then((response) => {
        setOrders(response.data);
        setLoadingOrders(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders. Please try again.");
        setLoadingOrders(false);
      });
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-white bg-opacity-95 p-12 rounded-2xl shadow-xl max-w-6xl w-full m-4 transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-1/3">
            <div className="relative group">
              <img
                src={imageUrl || "https://via.placeholder.com/200"}
                alt="Profile Picture"
                className="rounded-full w-60 h-60 mx-auto object-cover border-8 border-blue-400 transition-all duration-300 ease-in-out group-hover:border-blue-500"
              />
              {isEditing && (
                <input
                  type="text"
                  value={imageUrl}
                  onChange={handleImageUrlChange}
                  placeholder="Enter image URL"
                  className="w-full p-3 mt-4 border rounded-lg bg-white bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 ease-in-out"
                />
              )}
            </div>
            <div className="text-center mt-6 space-y-2">
              <h2 className="text-3xl font-extrabold text-gray-900">
                {profile.username}
              </h2>
              <p className="text-gray-700">{profile.email}</p>
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <div className="rounded-lg p-8">
              <table className="w-full">
                <tbody>
                  {["username", "email"].map((field) => (
                    <tr key={field} className="border-b border-blue-200">
                      <td className="py-4 text-gray-700 font-semibold">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </td>
                      <td className="py-4">
                        {isEditing ? (
                          <input
                            type="text"
                            name={field}
                            value={profile[field]}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 ease-in-out"
                          />
                        ) : (
                          <span className="text-gray-900">
                            {profile[field]}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-10 flex space-x-6">
                {isEditing ? (
                  <button
                    onClick={handleSave}
                    className="flex items-center px-8 py-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <Save size={24} className="mr-2" />
                    Save Changes
                  </button>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="flex items-center px-8 py-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <Edit2 size={24} className="mr-2" />
                    Edit Profile
                  </button>
                )}
                <button
                  onClick={fetchOrders}
                  className="flex items-center px-8 py-4 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <ShoppingBag size={24} className="mr-2" />
                  Show Orders
                </button>
              </div>
            </div>

            {loadingOrders && (
              <div className="mt-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-3 text-gray-600">Loading orders...</p>
              </div>
            )}

            <ul className="mt-8 space-y-6">
              {orders.map((order) => (
                <li
                  key={order._id}
                  className="bg-white bg-opacity-90 rounded-lg p-6 shadow-md transition-all duration-300 ease-in-out hover:shadow-lg"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">
                      Order ID: {order._id}
                    </span>
                    <span className="text-green-600 font-semibold">
                      Total: ${order.totalAmount}
                    </span>
                  </div>
                  <div className="mt-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "Completed"
                          ? "bg-green-200 text-green-800"
                          : order.status === "Pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    {order.dishId.map((dish) => (
                      <p key={dish._id} className="text-gray-700">
                        {dish.title} -{" "}
                        <span className="text-blue-600">${dish.price}</span>
                      </p>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;