import React, { useState } from "react";
import Header from "./Header";
import ItalianDishCards from "./ItalianDishCards";
import FutureDishesSection from "./FutureDishesSection";
// import SpecialOffersSection from './SpecialOffersSection'
import Navbar from "../navbar";
import HistorySection from "./HistorySection";
import RecipeCards from "./ItalianRecipeCards";
import Footer from "../pages/Footer";
import ExploreMenu from "./ExploreMenu";

const Home = () => {
  const [category, setCategory] = useState("All");
  return (
    <div>
      {/* <Navbar /> */}
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <ItalianDishCards category={category} setCategory={setCategory} />
      <RecipeCards category={category} setCategory={setCategory} />
      <FutureDishesSection category={category} setCategory={setCategory} />
      {/* <SpecialOffersSection category={category} setCategory={setCategory}/> /}
      <HistorySection category={category} setCategory={setCategory}/>
      {/ <ExploreMenu category={category} setCategory={setCategory}/>
      <FoodDisplay category={category}/>
      <AppDownload/> */}
      {/* <Footer /> */}
    </div>
  );
};

export default Home;
