import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ChefDashboard() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ title: '', description: '', category: '', ingredients: '', price: '', instructions: '', cooktime: '' });
  const [chefId] = useState(localStorage.getItem('userId'));
  const [isEditing, setIsEditing] = useState(null);
  const [showDishes, setShowDishes] = useState(true);

  useEffect(() => {
    if (chefId && chefId !== "null") {
      fetchItems();
    }
  }, [chefId, showDishes]);

  const fetchItems = async () => {
    const response = await axios.get(`http://localhost:5001/api/${showDishes ? 'dishes' : 'recipes'}/${chefId}`);
    setItems(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await axios.put(`http://localhost:5001/api/${showDishes ? 'dishes' : 'recipes'}/${isEditing}`, { ...newItem, chefId });
      setIsEditing(null);
    } else {
      await axios.post(`http://localhost:5001/api/${showDishes ? 'dishes' : 'recipes'}`, { ...newItem, chefId });
    }
    fetchItems();
    setNewItem({ title: '', description: '', category: '', ingredients: '', price: '', instructions: '', cooktime: '' });
  };

  const handleEdit = (item) => {
    setIsEditing(item._id);
    setNewItem(item);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5001/api/${showDishes ? 'dishes' : 'recipes'}/${id}`);
    fetchItems();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Chef's Kitchen</h1>
        
        {/* Italian flag accent */}
        <div className="flex mb-8">
          <div className="w-1/3 h-2 bg-green-500"></div>
          <div className="w-1/3 h-2 bg-white"></div>
          <div className="w-1/3 h-2 bg-red-500"></div>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowDishes(true)}
            className={`px-4 py-2 rounded-l-lg ${showDishes ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Dishes
          </button>
          <button
            onClick={() => setShowDishes(false)}
            className={`px-4 py-2 rounded-r-lg ${!showDishes ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          >
            Recipes
          </button>
        </div>

        {/* Add/Edit Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Edit' : 'Add'} {showDishes ? 'Dish' : 'Recipe'}</h2>
          <div className="mb-4">
            <input type="text" placeholder="Title" value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <textarea placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24" />
          </div>
          <div className="mb-4">
            <input type="text" placeholder="Category" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <input type="text" placeholder="Ingredients" value={newItem.ingredients} onChange={(e) => setNewItem({ ...newItem, ingredients: e.target.value })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          {showDishes ? (
            <div className="mb-4">
              <input type="text" placeholder="Price" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
          ) : (
            <>
              <div className="mb-4">
                <textarea placeholder="Instructions" value={newItem.instructions} onChange={(e) => setNewItem({ ...newItem, instructions: e.target.value })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24" />
              </div>
              <div className="mb-4">
                <input type="text" placeholder="Cook Time" value={newItem.cooktime} onChange={(e) => setNewItem({ ...newItem, cooktime: e.target.value })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
            </>
          )}
          <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            {isEditing ? 'Update' : 'Add'} {showDishes ? 'Dish' : 'Recipe'}
          </button>
        </form>

        {/* Items List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4">
                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-gray-700 text-base mb-2">{item.description}</p>
                <p className="text-gray-600 text-sm mb-2">Category: {item.category}</p>
                <p className="text-gray-600 text-sm mb-2">Ingredients: {item.ingredients}</p>
                {showDishes ? (
                  <p className="text-gray-600 text-sm">Price: {item.price}</p>
                ) : (
                  <>
                    <p className="text-gray-600 text-sm mb-2">Instructions: {item.instructions}</p>
                    <p className="text-gray-600 text-sm">Cook Time: {item.cooktime}</p>
                  </>
                )}
              </div>
              <div className="px-4 py-2 bg-gray-100 flex justify-end">
                <button onClick={() => handleEdit(item)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2">
                  Edit
                </button>
                <button onClick={() => handleDelete(item._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChefDashboard;