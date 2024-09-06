import React from "react";

function NumberInputModel({ label, value, onChange, min = 1 }) {
  return (
    <div className="mb-4">
      <label htmlFor="numPeople" className="block font-medium text-gray-700">
        {label}
      </label>
      <input
        type="number"
        id="numPeople"
        min={min}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
  );
}

export default NumberInputModel;
