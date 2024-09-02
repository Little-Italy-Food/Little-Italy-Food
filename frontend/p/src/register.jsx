import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');  // Added email state
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('customer'); // Default to 'customer'
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5001/api/users/register', { username, email, password, userType });
      console.log('Registration successful:', response.data);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        setError(error.response.data.msg || 'Registration failed. Please try again.');
      } else if (error.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Error setting up the request. Please try again.');
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
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
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
