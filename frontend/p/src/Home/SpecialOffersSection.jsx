import React from 'react';

const offers = [
  {
    id: 1,
    title: 'Early Bird Special',
    description: 'Get 20% off on orders placed before 11 AM. Enjoy our delicious breakfast options at a discounted price!',
    expirationDate: '2024-09-30',
    image: 'https://cnn-arabic-images.cnn.io/cloudinary/image/upload/w_1920,c_scale,q_auto/cnnarabic/2022/04/27/images/211077.jpg',
  },
  {
    id: 2,
    title: 'Family Feast Deal',
    description: 'Order any two large pizzas and get a free dessert! Perfect for family gatherings or parties.',
    expirationDate: '2024-10-15',
    image: 'https://www.thaqfny.com/wp-content/uploads/2021/03/%D8%B7%D8%B1%D9%8A%D9%82%D8%A9-%D8%B9%D9%85%D9%84-%D8%A7%D9%84%D8%A8%D9%8A%D8%AA%D8%B2%D8%A7-%D8%A7%D9%84%D8%A5%D9%8A%D8%B7%D8%A7%D9%84%D9%8A%D8%A9-%D8%A7%D9%84%D8%B4%D9%87%D9%8A%D8%A9-%D8%A7%D9%84%D9%84%D8%B0%D9%8A%D8%B0%D8%A9-%D9%85%D8%AB%D9%84-%D8%A3%D8%B4%D9%87%D8%B1-%D8%A7%D9%84%D9%85%D8%B7%D8%A7%D8%B9%D9%85.jpg',
  },
  {
    id: 3,
    title: 'Weekend Brunch Offer',
    description: 'Enjoy a complimentary drink with every brunch order over $30. Available every weekend from 10 AM to 2 PM.',
    expirationDate: '2024-10-01',
    image: 'https://cdn.cobone.com/deals/ksa/restobellorestaurant+/steakorseafood-17feb/bigrestobellodinnerlunchmeal.jpg?v=7',
  },
];

const SpecialOffersSection = () => {
  return (
    <section className="relative bg-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Our Special Offers</h2>
          <p className="text-gray-600 mt-4">
            Check out our current discounts and promotions. Don't miss out on these limited-time offers!
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
              <img src={offer.image} alt={offer.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{offer.title}</h3>
                <p className="text-gray-600 mb-4">{offer.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Expires on: {new Date(offer.expirationDate).toLocaleDateString()}</span>
                  <button className="bg-red-500 text-white py-2 px-4 rounded-full border-none cursor-pointer transition-colors duration-300 hover:bg-red-600">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffersSection;
