import React, { useState } from "react";
import { Search, Mic } from "lucide-react";

const SearchBar = ({ onSearch, onVoiceSearch }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex justify-center w-full max-w-3xl mx-auto absolute top-[5rem] left-[23rem] z-50">
      <div
        className={`bg-white flex w-full px-4 py-3 rounded-full border-2 transition-all duration-300 ease-in-out ${
          isFocused ? "border-[#FF5733] shadow-lg" : "border-gray-300 shadow-md"
        }`}
      >
        <Search className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-[7px]" />
        <input
          type="text"
          placeholder="Search for recipes..."
          className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-400"
          onChange={(e) => onSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button
          className="bg-[#FF5733] hover:bg-green-600 transition-all text-white rounded-full p-2 ml-2 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-green-300"
          onClick={onVoiceSearch}
          aria-label="Voice Search"
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
