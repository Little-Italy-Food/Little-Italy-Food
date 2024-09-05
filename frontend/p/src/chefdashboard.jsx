import React, { useEffect, useState } from "react";
import axios from "axios";
import RecipeForm from "./components/RecipeForm";
import DishesList from "./components/DishesList";
import RecipesList from "./components/RecipesList";
import Chefinfo from "./chefinfo";
import { Link } from "react-router-dom";

function ChefDashboard() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("dishes");
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    category: "",
    ingredients: "",
    price: "",
    instructions: "",
    cooktime: "",
    imageUrl: "",
  });
  const [chefId] = useState(localStorage.getItem("userId"));
  const [isEditing, setIsEditing] = useState(null);
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    if (chefId && chefId !== "null") {
      fetchItems();
      if (activeTab === "orders") {
        fetchOrders();
        fetchChefProfile();
      }
    }
  }, [chefId, activeTab]);

  const fetchItems = async () => {
    let url;
    if (activeTab === "dishes") {
      url = `http://localhost:5001/api/dishes/${chefId}`;
    } else if (activeTab === "recipe") {
      url = `http://localhost:5001/api/recipes/by-chef`;
    }
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };


  const fetchChefProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/chefinfo/profile/${chefId}` ,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setProfileImage(response.data.image || "default-profile-image-url");
    } catch (error) {
      console.error("Error fetching chef profile:", error);
    }
  };


  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/cheforders/chef/${chefId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = activeTab === "dishes" ? "dishes" : "recipes";
    const url = isEditing
      ? `http://localhost:5001/api/${endpoint}/${isEditing}`
      : `http://localhost:5001/api/${endpoint}`;

    try {
      if (isEditing) {
        await axios.put(url, { ...newItem, chefId });
        setIsEditing(null);
      } else {
        await axios.post(url, { ...newItem, chefId });
      }
      fetchItems();
      setNewItem({
        title: "",
        description: "",
        category: "",
        ingredients: "",
        price: "",
        instructions: "",
        cooktime: "",
        imageUrl: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (item) => {
    setIsEditing(item._id);
    setNewItem(item);
  };

  const handleDelete = async (id) => {
    const endpoint = activeTab === "dishes" ? "dishes" : "recipes";
    try {
      await axios.delete(`http://localhost:5001/api/${endpoint}/${id}`);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5001/api/cheforders/${orderId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const isUserSubscribed = (user) => {
    return user && user.subscriptions && Array.isArray(user.subscriptions) && user.subscriptions.includes(chefId);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Chef's Kitchen
        </h1>

         {/* Chef profile image section */}
        <Link to="/chef/info" className="flex items-center space-x-4 mb-8">
          <img
            src={profileImage} // Image from database
            alt="Chef Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
          <p className="text-gray-700">View Chef Profile</p>
        </Link>

        <div className="flex mb-8">
          <div className="w-1/3 h-2 bg-green-500"></div>
          <div className="w-1/3 h-2 bg-white"></div>
          <div className="w-1/3 h-2 bg-red-500"></div>
        </div>
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setActiveTab("dishes")}
            className={`px-4 py-2 ${
              activeTab === "dishes" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            Dishes
          </button>
          <button
            onClick={() => setActiveTab("recipe")}
            className={`px-4 py-2 ${
              activeTab === "recipe" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            Recipe
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 ${
              activeTab === "orders" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            Orders
          </button>
        </div>
        {activeTab === "dishes" && (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            {/* ... (existing form code for dishes) */}
          </form>
        )}
        {activeTab === "recipe" && <RecipeForm />}
        {activeTab === "dishes" ? (
          <DishesList
            items={items}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ) : activeTab === "recipe" ? (
          <RecipesList
            items={items}
            setItems={setItems}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Order ID</th>
                    <th className="px-4 py-2 text-left">Customer</th>
                    <th className="px-4 py-2 text-left">Subscription</th>
                    <th className="px-4 py-2 text-left">Total Amount</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Order Date</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b">
                      <td className="px-4 py-2">{order._id}</td>
                      <td className="px-4 py-2">
                        <div>{order.user?.username || 'N/A'}</div>
                        <div className="text-sm text-gray-600">{order.user?.email || 'N/A'}</div>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          isUserSubscribed(order.user) ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'
                        }`}>
                          {isUserSubscribed(order.user) ? 'Subscribed' : 'Not Subscribed'}
                        </span>
                      </td>
                      <td className="px-4 py-2">${order.totalAmount?.toFixed(2) || '0.00'}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                          order.status === 'confirmed' ? 'bg-green-200 text-green-800' :
                          order.status === 'canceled' ? 'bg-red-200 text-red-800' :
                          'bg-blue-200 text-blue-800'
                        }`}>
                          {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-2">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-4 py-2">
                        <select
                          value={order.status || ''}
                          onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="canceled">Canceled</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChefDashboard;