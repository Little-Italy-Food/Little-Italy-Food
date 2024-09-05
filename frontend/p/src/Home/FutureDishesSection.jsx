import React from 'react';

const FutureDishesSection = () => {
  return (
    <section className="relative bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Future Dishes Coming Soon</h2>
          <p className="text-gray-600">
            Stay tuned for exciting new dishes that will be added to our menu soon. We are constantly exploring new flavors and culinary experiences to delight you.
          </p>
        </div>
        <div className="relative bg-cover bg-center h-[34vw] rounded-lg shadow-lg overflow-hidden" style={{ backgroundImage: "url('https://www.supermama.me/system/App/Entities/Article/images/000/105/156/watermarked/%D8%A3%D9%83%D9%84%D8%A7%D8%AA-%D8%A5%D9%8A%D8%B7%D8%A7%D9%84%D9%8A%D8%A9-%D9%85%D8%B4%D9%87%D9%88%D8%B1%D8%A9.jpg')" }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-black bg-opacity-40 rounded-lg transition-transform transform hover:scale-105">
            <h3 className="text-3xl font-bold text-white mb-4 animate-fadeIn">Coming Soon</h3>
            <p className="text-white mb-6 animate-fadeIn delay-150">Stay tuned to discover the new dishes we will be offering soon. We are excited to share these new additions with you!</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FutureDishesSection;
