// import React from 'react'
// import { menu_list } from '../../assets/assets'

// const ExploreMenu = ({category, setCategory}) => {

//   return (
//     <div className='flex flex-col gap-7' id='explore-menu'>
//         <h1 className='text-[#262626] font-medium'>Explore Our Menu</h1>
//         <p className='max-w-[60%] text-gray-500 sm:max-w-full sm:text-sm'>
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, exercitationem excepturi temporibus obcaecati voluptas vitae?
//         </p>
//         <div className="flex justify-between items-center gap-7 text-center my-5 overflow-scroll no-scrollbar">
//             {menu_list.map((item, index) => {
//                 return (
//                     <div 
//                         onClick={() => setCategory(prev => prev === item.menu_name ? 'All' : item.menu_name)} 
//                         key={index} 
//                         className="cursor-pointer"
//                     >
//                         <img 
//                             className={`${category === item.menu_name ? 'border-4 border-tomato p-1.5' : ''} w-[7.5vw] min-w-[80px] rounded-full transition duration-200 cursor-pointer`} 
//                             src={item.menu_image} 
//                             alt={item.menu_name} 
//                         />
//                         <p className='mt-2 text-gray-500 text-[max(1.4vw,16px)]'>{item.menu_name}</p>
//                     </div>
//                 )
//             })}
//         </div>
//         <hr className='my-2 h-0.5 bg-gray-200 border-none' />
//     </div>
//   )
// }

// export default ExploreMenu






// import React from 'react';

// const menuItems = [
//   { name: 'Salad', image: 'https://www.onstek.com/wp-content/uploads/2023/04/best-spaghetti-recipes.jpg' },
//   { name: 'Rolls', image: 'https://e3.365dm.com/18/04/1600x900/skynews-pasta-gi-health-bmj_4272669.jpg?20180430171358' },
//   { name: 'Deserts', image: 'https://enviragallery.com/wp-content/uploads/2015/12/neat-plates-looks-good.jpg' },
//   { name: 'Sandwich', image: 'https://www.onstek.com/wp-content/uploads/2023/04/best-spaghetti-recipes.jpg' },
//   { name: 'Cake', image: 'https://www.onstek.com/wp-content/uploads/2023/04/best-spaghetti-recipes.jpg' },
//   { name: 'Pure Veg', image: 'https://e3.365dm.com/18/04/1600x900/skynews-pasta-gi-health-bmj_4272669.jpg?20180430171358' },
//   { name: 'Pasta', image: 'https://enviragallery.com/wp-content/uploads/2015/12/neat-plates-looks-good.jpg' },
//   { name: 'Noodles', image: 'https://www.onstek.com/wp-content/uploads/2023/04/best-spaghetti-recipes.jpg' },
// ];

// const MenuExplorer = () => {
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-4xl font-bold mb-4">Explore Our Menu</h1>
//       <p className="text-gray-600 mb-8">
//         Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, exercitationem excepturi temporibus obcaecati voluptas vitae?
//       </p>
//       <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
//         {menuItems.map((item, index) => (
//           <div key={index} className="flex flex-col items-center">
//             <div className="w-32 h-32 rounded-full overflow-hidden mb-2">
//               <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
//             </div>
//             {/* زيادة حجم الخط من text-sm إلى text-lg لتكبير النصوص */}
//             <span className="mt-2 text-lg text-gray-700">{item.name}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MenuExplorer;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MenuExplorer = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/dishescategory');
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching dishes:', error);
      }
    };

    fetchDishes();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Explore Our Menu</h1>
      <p className="text-gray-600 mb-8">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, exercitationem excepturi temporibus obcaecati voluptas vitae?
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
        {menuItems.map((item) => (
          <div key={item._id} className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-2">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <span className="mt-2 text-lg text-gray-700">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuExplorer;
