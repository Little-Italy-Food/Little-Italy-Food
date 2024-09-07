import React from "react";
import { ChevronRight } from "lucide-react"; //ChevronRight ايقونه من lucide مستخدمه برز اقرا المزيد

const HistorySection = () => {
  const historyContent = [
    {
      title: "Ancient Origins",
      text: "The history of Italian cuisine dates back over 2,000 years, starting with ancient Roman civilizations. It revolved around bread, olives, and grapes, with some meat and fish.",
      imageUrl:
        "https://s3.amazonaws.com/s3.timetoast.com/public/uploads/photos/2372914/B002057.jpg?1474070527",
      date: "Over 2,000 years ago",
      url: "https://www.ksalim.com/2023/05/Italian-kitchen.html#:~:text=%D9%8A%D8%B9%D9%88%D8%AF%20%D8%AA%D8%A7%D8%B1%D9%8A%D8%AE%20%D8%A7%D9%84%D9%85%D8%B7%D8%A8%D8%AE%20%D8%A7%D9%84%D8%A5%D9%8A%D8%B7%D8%A7%D9%84%D9%8A%20%D8%A5%D9%84%D9%89%20%D8%A7%D9%84%D8%B9%D8%B5%D9%88%D8%B1%20%D8%A7%D9%84%D9%88%D8%B3%D8%B7%D9%89%D8%8C%20%D8%AD%D9%8A%D8%AB", // Add the URL here
    },
    {
      title: "Cultural Heritage",
      text: "Italian cuisine is not just food; it is part of Italy's cultural heritage, with traditions passed down through generations and families.",
      imageUrl:
        "https://th.bing.com/th/id/OIP.vuqJFMt2_ynnko-EKrhbRgHaE8?rs=1&pid=ImgDetMain",
      date: "Today",
      url: "https://doyourorder.com/ar/blog/italian-restaurants-and-their-rich-cultural-heritage-66/", // Add the URL here
    },
  ];

  return (
    <section className="bg-gradient-to-b bg-[#f2eeee]">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-amber-800 text-center mb-12">
          A Journey into the Heart of Italian Cuisine
        </h2>
        <div className="space-y-16">
          {historyContent.map((item, index) => (
            <div
              key={index}
              className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-12 space-y-6 lg:space-y-0"
            >
              <div
                className={`w-full lg:w-1/2 ${
                  index % 2 === 0 ? "lg:order-2" : ""
                }`}
              >
                <div className="relative w-full h-64 rounded-xl shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-105">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                  <span className="absolute bottom-4 left-4 text-white font-semibold">
                    {item.date}
                  </span>
                </div>
              </div>
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h3 className="text-2xl font-semibold text-amber-700 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                  {item.text}
                </p>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <button className="inline-flex items-center text-amber-600 hover:text-amber-700 transition-colors duration-300">
                    Read more
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HistorySection;
