import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CartProvider } from "./cartcontext";
// import { UserProvider } from "./usercontext";
import Login from "../src/login";
import Register from "../src/register";
import ChefDashboard from "./chefdashboard";
import DishesPage from "./dishespage";
import DishDetailsPage from "./dishdetailspage";
import Cart from "./cart";
import Checkout from "./checkout";
import Navbar from "./navbar";
// import ChefProfile from "./chefprofile";
import OrderConfirmation from "./orderconfirmation";
import AddRecipe from "./pages/AddRecipe";
import Home from "./Home/Home";
import RecipeCards from "./pages/ricipe-listin";
import ContactUs from "./contact/contact";
import Chefinfo from "./chefinfo";
import UserProfile from "./userprofile";
import Footer from "./pages/Footer";
import AboutUs from "./pages/About";

import SavedRecipe from "./pages/SavedRecipe";

const NavbarWrapper = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

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
            <div className="min-h-screen bg-gray-100">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/SavedRecipe"
                  element={
                    <NavbarWrapper>
                      <SavedRecipe />
                    </NavbarWrapper>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <NavbarWrapper>
                      <AboutUs />
                    </NavbarWrapper>
                  }
                />
                <Route
                  path="/dishespage"
                  element={
                    <NavbarWrapper>
                      <DishesPage />{" "}
                    </NavbarWrapper>
                  }
                />
                <Route
                  path="/dish/:id"
                  element={
                    <NavbarWrapper>
                      <DishDetailsPage />{" "}
                    </NavbarWrapper>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <NavbarWrapper>
                      <Cart />{" "}
                    </NavbarWrapper>
                  }
                />

                <Route
                  path="/checkout"
                  element={
                    <NavbarWrapper>
                      <Checkout />{" "}
                    </NavbarWrapper>
                  }
                />
                <Route
                  path="/recipes"
                  element={
                    <NavbarWrapper>
                      <RecipeCards />{" "}
                    </NavbarWrapper>
                  }
                />
                <Route
                  path="/"
                  element={
                    <NavbarWrapper>
                      <Home />
                    </NavbarWrapper>
                  }
                />
                <Route
                  path="/add-recipe"
                  element={
                    <NavbarWrapper>
                      <AddRecipe />{" "}
                    </NavbarWrapper>
                  }
                />
                <Route
                  path="/chef"
                  element={
                    <NavbarWrapper>
                      <ChefDashboard />
                    </NavbarWrapper>
                  }
                />
                <Route
                  path="/dishespage"
                  element={
                    <NavbarWrapper>
                      <DishesPage />
                    </NavbarWrapper>
                  }
                />
                <Route
                  path="/dish/:id"
                  element={
                    <NavbarWrapper>
                      <DishDetailsPage />
                    </NavbarWrapper>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <NavbarWrapper>
                      <Cart />
                    </NavbarWrapper>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <NavbarWrapper>
                      <Checkout />
                    </NavbarWrapper>
                  }
                />
                <Route
                  path="/order-confirmation"
                  element={
                    <NavbarWrapper>
                      <OrderConfirmation />
                    </NavbarWrapper>
                  }
                />
                <Route
                  path="/ourchefs"
                  element={
                    <NavbarWrapper>
                      <OurChefs />
                    </NavbarWrapper>
                  }
                />
                <Route
                  path="/chef/:id"
                  element={
                    <NavbarWrapper>
                      <ChefProfile />
                    </NavbarWrapper>
                  }
                />
                <Route
                  path="/recipes"
                  element={
                    <NavbarWrapper>
                      <RecipeCards />
                    </NavbarWrapper>
                  }
                />
                <Route
                  path="/add-recipe"
                  element={
                    <NavbarWrapper>
                      <AddRecipe />
                    </NavbarWrapper>
                  }
                />
                <Route
                  path="/home"
                  element={
                    <NavbarWrapper>
                      <Home />
                    </NavbarWrapper>
                  }
                />
                <Route
                  path="/userprofile"
                  element={
                    <NavbarWrapper>
                      <UserProfile />
                    </NavbarWrapper>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <NavbarWrapper>
                      <ContactUs />
                    </NavbarWrapper>
                  }
                />
                <Route
                  path="/recipe/:id"
                  element={
                    <NavbarWrapper>
                      <DishDetailsPage />
                    </NavbarWrapper>
                  }
                />
                <Route
                  path="/"
                  element={<Navigate to="/dishespage" replace />}
                />

                <Route
                  path="/chef/info"
                  element={
                    <NavbarWrapper>
                      <Chefinfo />{" "}
                    </NavbarWrapper>
                  }
                />

                <Route
                  path="/recipe1/:id"
                  element={
                    <NavbarWrapper>
                      <RecipeView />{" "}
                    </NavbarWrapper>
                  }
                />
                <Route
                  path="/recipe-finder"
                  element={
                    <NavbarWrapper>
                      <RecipeFinder />{" "}
                    </NavbarWrapper>
                  }
                />
                <Route
                  path="/substitute-finder"
                  element={
                    <NavbarWrapper>
                      <SubstituteFinder />{" "}
                    </NavbarWrapper>
                  }
                />
              </Routes>
              <ToastContainer />
            </div>
          </Router>
          <Footer />
        </CartProvider>
      </UserProvider>
    </PayPalScriptProvider>
  );
}

export default App;
