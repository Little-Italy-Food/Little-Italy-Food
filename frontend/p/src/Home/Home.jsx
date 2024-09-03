import React, { useState } from 'react'
import Header from './Header'
import ItalianDishCards from './FoodDisplay'
import FutureDishesSection from './FutureDishesSection'
import SpecialOffersSection from './SpecialOffersSection'



const Home = () => {

  const [category, setCategory] = useState('All')
  return (
    <div>
        
      <Header/>
      <ItalianDishCards category={category} setCategory={setCategory}/>
      <FutureDishesSection category={category} setCategory={setCategory}/>
      <SpecialOffersSection category={category} setCategory={setCategory}/>
      {/* <ExploreMenu category={category} setCategory={setCategory}/>
      <FoodDisplay category={category}/>
      <AppDownload/> */}
    </div>
  )
}

export default Home