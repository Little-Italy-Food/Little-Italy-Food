import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import backgroundImage from "../src/assets/bgi.jpg"; // Adjust the path as needed

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("customer");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5001/api/users/login",
        { email, password, userType }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);

      if (userType === "chef") {
        navigate("/chef");
      } else {
        navigate("/Home");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data.msg || "Login failed. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-md w-full space-y-8 p-10 rounded-xl shadow-xl backdrop-filter backdrop-blur-lg bg-white bg-opacity-10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-white italic">
            Benvenuto nella nostra cucina italiana
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-white"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-green-300 hover:text-green-200"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white">
              I am a
            </label>
            <div className="mt-1 flex space-x-4">
              <button
                type="button"
                onClick={() => setUserType("customer")}
                className={`flex-1 py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  userType === "customer"
                    ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setUserType("chef")}
                className={`flex-1 py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  userType === "chef"
                    ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Chef
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Sign in
            </button>
          </div>
        </form>
        {error && (
          <div className="mt-3 text-red-300 text-sm text-center">{error}</div>
        )}
        <div className="text-center mt-4">
          <Link
            to="/register"
            className="font-medium text-white hover:text-green-200"
          >
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
