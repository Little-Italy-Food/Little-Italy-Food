import React from "react";

const DishesList = ({ items, handleEdit, handleDelete }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {items.map((item) => (
      <div
        key={item._id}
        className="bg-white shadow-md rounded-lg overflow-hidden"
      >
        {item.imageUrl && (
          <div
            className="h-48 bg-cover bg-center"
            style={{ backgroundImage: `url(${item?.imageUrl})` }}
          />
        )}
        <div className="p-4">
          <h3 className="font-bold text-xl mb-2">{item?.title}</h3>
          <p className="text-gray-700 text-base mb-2">{item?.description}</p>
          <p className="text-gray-600 text-sm mb-2">
            Category: {item?.category}
          </p>
          <p className="text-gray-600 text-sm mb-2">
            Ingredients:{" "}
            {Array.isArray(item.ingredients)
              ? item.ingredients.join(", ")
              : item.ingredients}
          </p>

          <p className="text-gray-600 text-sm">Price: {item?.price}</p>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => {
                console.log("Edit clicked:", item); // Log the item object
                handleEdit(item);
              }}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Edit
            </button>
            <button
              onClick={() => {
                console.log("Delete clicked:", item); // Log the item object
                handleDelete(item._id);
              }}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default DishesList;
