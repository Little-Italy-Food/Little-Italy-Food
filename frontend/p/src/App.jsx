import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CartProvider } from "./cartcontext";
import Login from "../src/login";
import Register from "../src/register";
import ChefDashboard from "./chefdashboard";
import DishesPage from "./dishespage";
import DishDetailsPage from "./dishdetailspage";
import Cart from "./cart";
import Checkout from "./checkout";
import OrderConfirmation from "./orderconfirmation";
import AddRecipe from "./pages/AddRecipe";
import Home from "./Home/Home";
import RecipeCards from "./pages/ricipe-listin";
import ContactUs from "./contact/contact";
import { UserProvider } from "./usercontext";
import OurChefs from "./ourchefs";
import ChefProfile from "./chefprofile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RecipeView from "./pages/RecipeView";

import RecipeFinder from "./pages/RecipeFinder";
import SubstituteFinder from "./pages/SubstituteFinder";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AV02eqe3RJg8sU_mXlo8dKbod7dEscG1WCzeN-tc-qV5eYN9WupElGxlJ4rKtGoYMK9BwbOlOdT34Wb1",
      }}
    >
      <UserProvider>
        <CartProvider>
          <Router>
            <div className="">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/chef" element={<ChefDashboard />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dishespage" element={<DishesPage />} />
                <Route path="/dish/:id" element={<DishDetailsPage />} />
                <Route path="/cart" element={<Cart />} />

                <Route path="/checkout" element={<Checkout />} />
                <Route path="/recipes" element={<RecipeCards />} />
                <Route path="/" element={<Home />} />
                <Route path="/add-recipe" element={<AddRecipe />} />
                <Route
                  path="/order-confirmation"
                  element={<OrderConfirmation />}
                />
                <Route path="/contact" element={<ContactUs />} />
                <Route
                  path="/ourchefs"
                  element={
                    // <NavbarWrapper>
                    <OurChefs />
                    // </NavbarWrapper>
                  }
                />
                <Route
                  path="/chef/:id"
                  element={
                    // <NavbarWrapper>
                    <ChefProfile />
                    // </NavbarWrapper>
                  }
                />
                <Route path="/recipe/:id" element={<RecipeView />} />
                <Route path="/recipe-finder" element={<RecipeFinder />} />
                <Route
                  path="/substitute-finder"
                  element={<SubstituteFinder />}
                />
              </Routes>
              <ToastContainer />
            </div>
          </Router>
        </CartProvider>
      </UserProvider>
    </PayPalScriptProvider>
  );
}

export default App;
