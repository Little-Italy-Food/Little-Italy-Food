// src/components/Pagination.jsx
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div>
      <div className="flex justify-center space-x-2 -mt-5  ">
        {" "}
        {/* Adjust mb value for testing */}
        <button
          className="bg-[#FF5733] text-white py-2 px-4 rounded-lg"
          // disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Prev
        </button>
        <button
          className="bg-[#FF5733] text-white py-2 px-4 rounded-lg"
          // disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
