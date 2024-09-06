import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import Logo from "../../img/logo.png";

const Auth = () => {
  return (
    <div className="Auth">
      <div className="a-left">
        <img src={Logo} alt="" className="logo" />
        <div className="Webname">
          <h1>little italy media</h1>
          <h6>Explore the recipes throughout the world</h6>
        </div>
      </div>
      <LogIn />
    </div>
  );
};

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("customer"); // Default to "user"
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/users/login",
        {
          email,
          password,
          userType,
        }
      );
      localStorage.setItem("accessToken", response.data.token);
      navigate("/home");
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed: " + error.response.data.message);
    }
  };

  return (
    <div className="a-right">
      <form className="infoForm authForm" onSubmit={handleLogin}>
        <h3>Log In</h3>

        <div>
          <input
            type="email"
            placeholder="Email"
            className="infoInput"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="password"
            className="infoInput"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>
            <input
              type="radio"
              name="userType"
              value="chef"
              checked={userType === "chef"}
              onChange={(e) => setUserType(e.target.value)}
            />
            Chef
          </label>
          <label>
            <input
              type="radio"
              name="userType"
              value="customer"
              checked={userType === "customer"}
              onChange={(e) => setUserType(e.target.value)}
            />
            User
          </label>
        </div>

        <div>
          <Link to="http://localhost:5173/register">
            <span style={{ fontSize: "12px" }}>
              Don't have an account? Sign up
            </span>
          </Link>
          <button type="submit" className="button infoButton">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Auth;
