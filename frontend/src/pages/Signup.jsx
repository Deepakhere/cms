import React, { useState } from "react";
import "./assests/signup.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Link } from "react-router-dom";
import apiService from "../services/api";

const Signup = () => {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = (event) => {
    event.preventDefault();
    apiService.auth
      .register({ username, email, password })
      .then((result) => {
        console.log(result);
        toast.success(result.data);
        window.location.href = "/login";
      })
      .catch((err) => {
        console.log(err);
        toast.error("Registration failed. Please try again.");
      });
  };

  return (
    <div className="register-container">
      <div className="form-container">
        <div className="logo-text">
          <svg
            width="84"
            height="84"
            viewBox="0 0 45 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M27.6581 10.864C28.5585 11.6913 25.7358 12.032 22.7671 20.6461C19.3847 30.4769 21.1124 34.1026 22.7184 36.5603C23.8621 38.3123 
          18.8007 37.6067 17.8274 36.6333C14.2503 33.1536 19.0197 28.5545 16.1483 27.5082C14.007 26.7052 16.3673 34.1999 14.6153 33.8593C10.9896 
          33.1293 9.84592 25.3668 10.0163 23.0065C10.2353 19.7701 11.5736 19.8918 12.766 18.4074C14.007 16.8987 14.445 14.9277 15.4183 13.2487C16.8053 
          10.8397 25.3708 8.77129 27.6581 10.864ZM20.6987 17.1421C21.5504 15.7064 22.0371 14.1977 20.6257 15.7794C18.387 18.2857 14.2016 25.1965 17.511
          24.7585C19.7984 24.4422 18.9467 20.0864 20.6987 17.1421Z"
              fill="#4F46E5"
            />
            <path
              d="M38.0035 23.253C37.9305 26.4163 25.5447 25.2727 28.8784 28.509C31.7011 31.2344 34.3291 25.6863 36.9571 25.9783C38.5145 26.1487 
          37.9305 28.1197 37.6142 29.166C36.2271 33.7408 31.4577 38.1452 26.664 38.1452C21.2133 38.1452 21.6513 26.8057 23.671 20.9656C26.2747 13.4709 
          29.0001 11.0862 30.6547 11.6702C34.2805 12.9112 37.9305 17.4616 37.5168 20.7223C37.2248 23.0583 26.4694 22.6933 28.927 23.983C30.8007 24.9563
          38.0278 22.2553 38.0035 23.253Z"
              fill="#4F46E5"
            />
          </svg>
          <h2>Rapid Page Builder</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <h3 className="register">Register</h3>
          <div className="form-group">
            <label htmlFor="Uname">Username</label>
            <input
              type="text"
              className="form-control contentclass"
              placeholder="Enter your full name"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              className="form-control contentclass"
              id="email"
              placeholder="Enter your email address"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control contentclass"
              id="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input contentclass"
              id="exampleCheck1"
            />
            <label className="form-check-label" htmlFor="exampleCheck1">
              Subscribe to our newsletter
            </label>
          </div>
          <p className="description">
            Your personal data will be used to support your experience
            throughout this website, to manage access to your account, and for
            other purposes described in our <Link to="">privacy policy.</Link>
          </p>

          {/* <Link to="/"> */}
          <button type="submit" className="btn">
            Register
          </button>
          {/* </Link> */}

          <Link to="/login">
            <button type="button" className="btn">
              Login
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Signup;
