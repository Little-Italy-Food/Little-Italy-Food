import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ContactUs from './contact/contact';



function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path='/contact' element={<ContactUs/ >}/>     
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