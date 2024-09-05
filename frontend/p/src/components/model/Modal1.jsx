// Modal1.js
import React from "react";

const Modal1 = ({ isOpen, onClose, imageSrc, title, text }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-yellow-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            &times;
          </button>
        </div>
        <div className="my-4 text-center">
          <img src={imageSrc} alt="Medal" className="w-24 h-24 mx-auto" />
        </div>
        <p className="text-center text-gray-700">{text}</p>
      </div>
    </div>
  );
};

export default Modal1;
