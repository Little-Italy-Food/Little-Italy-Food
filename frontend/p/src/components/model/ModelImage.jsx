// Modal.js
import React from "react";

const Modal = ({ isOpen, onClose, imageSrc }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <button
          className="absolute top-1 right-1 text-black text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <img
          src={imageSrc}
          alt="Modal"
          className="w-full max-h-80 object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

export default Modal;
