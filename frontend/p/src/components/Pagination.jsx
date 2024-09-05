// src/components/Pagination.jsx
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div>
      <div className="flex justify-center space-x-2 mt-4 mb-24 ml-[29rem]">
        {" "}
        {/* Adjust mb value for testing */}
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-lg"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-lg"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
      <br />
    </div>
  );
};

export default Pagination;
