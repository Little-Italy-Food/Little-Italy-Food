import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wine, Star, Clock } from "lucide-react";
import italianCuisineVideo from "../assets/new/3195369-uhd_2560_1440_25fps.mp4";
const Header = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const features = [
    { icon: Wine, text: "Exquisite Wines" },
    { icon: Star, text: "Michelin Starred" },
    { icon: Clock, text: "Open Late" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVideoLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <video
        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isVideoLoaded ? "opacity-30" : "opacity-0"
        }`}
        autoPlay
        loop
        muted
        playsInline
        onCanPlayThrough={() => setIsVideoLoaded(true)}
      >
        <source src={italianCuisineVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="font-serif text-2xl text-orange-300 tracking-widest mb-2">
            WELCOME TO
          </h2>
          <h1 className="font-serif text-6xl md:text-8xl text-white mb-4 tracking-tight">
            Little Italy
          </h1>
          <div className="w-24 h-1 bg-orange-300 mx-auto"></div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-light text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl"
        >
          Experience the pinnacle of Italian gastronomy in an ambiance of
          unparalleled elegance
        </motion.p>

        <div className="relative h-20 mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              {React.createElement(features[activeIndex].icon, {
                className: "text-orange-300 w-12 h-12 mb-2",
              })}
              <span className="text-white text-lg">
                {features[activeIndex].text}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#D97706" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-orange-600 text-white font-semibold py-3  px-8 rounded-none text-lg transition-colors duration-300 shadow-lg border border-orange-400"
        >
          Reserve Your Table
        </motion.button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
};

export default Header;
