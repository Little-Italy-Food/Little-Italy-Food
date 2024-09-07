import React from "react";
import italianCuisineVideo from "../assets/123629-728697948_tiny.mp4";

const Header = () => {
  return (
    <div className="relative h-[100vh] mx-auto bg-cover bg-center shadow-lg overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover filter brightness-85"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={italianCuisineVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black bg-opacity-25"></div>
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
        <h1 className="font-serif text-6xl md:text-8xl text-white mb-4 animate-fadeIn">
          La Dolce Vita
        </h1>
        <p className="font-sans text-xl md:text-2xl text-white mb-8 max-w-2xl animate-fadeIn delay-300">
          Savor authentic Italian cuisine, from fresh pizza to delicious pasta
        </p>
        <button className="bg-red-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-red-700 transition-colors duration-300 animate-fadeIn delay-600">
          Explore Our Menu
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
};

export default Header;
