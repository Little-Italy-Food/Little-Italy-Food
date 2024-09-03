import React, { useEffect, useState } from "react";
import axios from "axios";
import RecipeForm from "./components/RecipeForm";
import DishesList from "./components/DishesList";
import RecipesList from "./components/RecipesList";

function ChefDashboard() {
  const [items, setItems] = useState([]);
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

  useEffect(() => {
    if (chefId && chefId !== "null") {
      fetchItems();
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
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Chef's Kitchen
        </h1>
        <div className="flex mb-8">
          <div className="w-1/3 h-2 bg-green-500"></div>
          <div className="w-1/3 h-2 bg-white"></div>
          <div className="w-1/3 h-2 bg-red-500"></div>
        </div>
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setActiveTab("dishes")}
            className={`px-4 py-2 rounded-l-lg ${
              activeTab === "dishes" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            Dishes
          </button>
          <button
            onClick={() => setActiveTab("recipe")}
            className={`px-4 py-2 rounded-r-lg ${
              activeTab === "recipe" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            Recipe
          </button>
        </div>
        {activeTab === "dishes" && (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <h2 className="text-2xl font-semibold mb-4">
              {isEditing ? "Edit" : "Add"} Dish
            </h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Title"
                value={newItem.title}
                onChange={(e) =>
                  setNewItem({ ...newItem, title: e.target.value })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Description"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Category"
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({ ...newItem, category: e.target.value })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Ingredients"
                value={newItem.ingredients}
                onChange={(e) =>
                  setNewItem({ ...newItem, ingredients: e.target.value })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Price"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Image URL"
                value={newItem.imageUrl}
                onChange={(e) =>
                  setNewItem({ ...newItem, imageUrl: e.target.value })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isEditing ? "Update" : "Add"} Dish
            </button>
          </form>
        )}
        {activeTab === "recipe" && <RecipeForm />}
        {activeTab === "dishes" ? (
          <DishesList
            items={items}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ) : (
          <RecipesList
            items={items}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

export default ChefDashboard;
