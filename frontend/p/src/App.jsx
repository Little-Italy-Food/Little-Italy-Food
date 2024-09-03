import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CartProvider } from './cartcontext';
import Login from '../src/login';
import Register from '../src/register';
import ChefDashboard from './chefdashboard';
import DishesPage from './dishespage';
import DishDetailsPage from './dishdetailspage';
import Cart from './cart';
import Checkout from './checkout';
import OrderConfirmation from './orderconfirmation';
import AddRecipe from "./pages/AddRecipe";
import Home from "./Home/Home";
import RecipeCards from "./pages/ricipe-listin";

function App() {
  return (
    <PayPalScriptProvider options={{ "client-id": "AV02eqe3RJg8sU_mXlo8dKbod7dEscG1WCzeN-tc-qV5eYN9WupElGxlJ4rKtGoYMK9BwbOlOdT34Wb1" }}>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
         
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/chef" element={<ChefDashboard />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dishespage" element={<DishesPage />} />
              <Route path="/dish/:id" element={<DishDetailsPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/recipes" element={<RecipeCards />} />
              <Route path="/home" element={<Home />} />
              <Route path="/add-recipe" element={<AddRecipe />} />      
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </PayPalScriptProvider>
  );
}

// function PrivateRoute({ children }) {
//   const token = localStorage.getItem('token');
//   return token ? children : <Navigate to="/login" replace />;
// }

export default App;
