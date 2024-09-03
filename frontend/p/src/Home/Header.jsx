import React from 'react';

const Header = () => {
  return (
    <div className='relative h-[34vw] mx-auto mt-8 border-4 border-[#D4A017] bg-cover bg-center shadow-lg' style={{ backgroundImage: "url('https://cdn.discordapp.com/attachments/1263051013607129230/1280074932134612993/b1910bd07d733044.jpg?ex=66d6c22e&is=66d570ae&hm=a86206ce96f61ab967397c9ab1e5835e9017ed8ea7b0523a7cc2c3da6f226b31&')" }}>
        <div className="absolute flex flex-col items-start gap-[1.5vw] max-w-[50%] bottom-[10%] left-[6vw] animate-fadeIn">
            <h2 className="font-semibold text-[#FF5733] text-[max(4.5vw,22px)] text-shadow-lg">
                Explore Thai Cuisine
            </h2>
            <p className="text-white text-[1.2vw] text-shadow-md hidden md:block">
                Indulge in the flavors of Thailand, from the spicy and sour to the sweet and savory.
            </p>
            <button className="border-none text-white font-semibold py-[1vw] px-[2.5vw] bg-[#1C6B0A] text-[max(1vw,13px)] rounded-full hover:bg-[#145206] transition-colors">
                View Menu
            </button>
        </div>
    </div>
  );
}

export default Header;
