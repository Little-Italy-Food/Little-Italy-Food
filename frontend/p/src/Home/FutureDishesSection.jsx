import React from "react";
import { motion } from "framer-motion";
import { ChefHat, Utensils, Clock } from "lucide-react";

const FutureDishesSection = () => {
  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Future Dishes Coming Soon
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay tuned for exciting new dishes that will be added to our menu
            soon. We are constantly exploring new flavors and culinary
            experiences to delight you.
          </p>
        </motion.div>

        <div className="flex justify-center space-x-8 mb-12">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center"
          >
            <ChefHat size={48} className="text-orange-500 mb-2" />
            <p className="text-sm font-medium text-gray-700">Expert Chefs</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center"
          >
            <Utensils size={48} className="text-orange-500 mb-2" />
            <p className="text-sm font-medium text-gray-700">Unique Flavors</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center"
          >
            <Clock size={48} className="text-orange-500 mb-2" />
            <p className="text-sm font-medium text-gray-700">Coming Soon</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative bg-cover bg-center h-[34vw] rounded-lg shadow-lg overflow-hidden"
          style={{
            backgroundImage:
              "url('https://www.supermama.me/system/App/Entities/Article/images/000/105/156/watermarked/أكلات-إيطالية-مشهورة.jpg')",
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-black bg-opacity-40 rounded-lg transition-all duration-300 hover:bg-opacity-50">
            <motion.h3
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-white mb-4"
            >
              Coming Soon
            </motion.h3>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white mb-6 text-center max-w-md"
            >
              Stay tuned to discover the new dishes we will be offering soon. We
              are excited to share these new additions with you!
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-orange-600 text-white px-6 py-3 rounded-full font-medium hover:bg-orange-700 transition-colors duration-300"
            >
              Notify Me
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FutureDishesSection;
