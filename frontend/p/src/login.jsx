import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState(''); // Replacing username with email
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('customer'); // Default to 'customer'
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5001/api/users/login', { email, password, userType });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId); // Store the userId
      
      // Navigate to the correct path based on userType
      if (userType === 'chef') {
        navigate('/chef'); // Navigate to the chef dashboard
      } else {
        navigate('/dashboard'); // Navigate to the customer dashboard
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        setError(error.response.data.msg || 'Login failed. Please try again.');
      } else if (error.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Error setting up the request. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="customer">Customer</option>
          <option value="chef">Chef</option>
        </select>
        <button type="submit" className="w-full p-2 mb-4 bg-blue-500 text-white rounded">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
