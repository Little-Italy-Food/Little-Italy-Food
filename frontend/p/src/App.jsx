import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "../src/login";
import Register from "../src/register";
import ChefDashboard from "./chefdashboard";
import DishesPage from "./dishespage";
import DishDetailsPage from "./dishdetailspage";
// import AddRecipe from "../src/components/RecipeForm";
import Home from "./Home/Home";

import AddRecipe from "./pages/AddRecipe";
import RecipeCards from "./pages/ricipe-listin";
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chef" element={<ChefDashboard />} />
          <Route path="/" element={<Register />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/dishespage" element={<DishesPage />} />
          <Route path="/dish/:id" element={<DishDetailsPage />} />
          <Route path="/recipes" element={<RecipeCards />} />
        </Routes>
      </div>
    </Router>
  );
}

// function PrivateRoute({ children }) {
//   const token = localStorage.getItem('token');
//   return token ? children : <Navigate to="/login" replace />;
// }

export default App;
