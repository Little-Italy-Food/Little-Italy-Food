import React from "react";

const SearchBar = ({ onSearch }) => {
  return (
    <div className="flex items-center mb-4">
      <input
        type="text"
        placeholder="Search for recipes..."
        className="border rounded-l-lg p-2 w-full"
        onChange={(e) => onSearch(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white p-2 rounded-r-lg"
        onClick={() => alert("Voice Search Activated")}
      >
        🎙️
      </button>
    </div>
  );
};

export default SearchBar;
