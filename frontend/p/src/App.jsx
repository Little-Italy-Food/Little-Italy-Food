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
import AddRecipe from "./pages/AddRecipe";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/chef" element={<ChefDashboard />} />
          <Route path="/" element={<Register />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
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
