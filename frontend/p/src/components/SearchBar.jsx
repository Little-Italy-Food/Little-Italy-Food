import React from "react";

const SearchBar = ({ onSearch, onVoiceSearch }) => {
  return (
    <div className="flex justify-center ml-[30rem] absolute top-[10rem] z-50">
      <div className="bg-white flex w-[40rem] px-1 py-1 rounded-full border border-green-500 overflow-hidden  font-sans">
        <input
          type="text"
          placeholder="Search for recipes..."
          className="w-full outline-none bg-white pl-4 text-sm"
          onChange={(e) => onSearch(e.target.value)}
        />
        <button
          className="bg-green-500 hover:bg-green-600 transition-all text-white text-sm rounded-full px-5 py-2.5"
          onClick={onVoiceSearch}
        >
          🎙️
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
