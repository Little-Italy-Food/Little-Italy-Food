// src/components/BookCard.jsx
import React from "react";

const BookCard = ({ book }) => {
  return (
    <div className="w-60 h-80 bg-gray-100 shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105">
      <div
        className="h-full w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${book.coverImage})` }}
      >
        <div className="bg-gradient-to-t from-black via-transparent to-transparent h-full p-4 flex flex-col justify-end">
          <h3 className="text-white text-lg font-bold">{book.title}</h3>
          <p className="text-gray-300">{book.author}</p>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
