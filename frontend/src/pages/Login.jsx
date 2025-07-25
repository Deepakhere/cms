import React from "react";
import "./assests/signup.css";
import { toast } from "react-toastify";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        navigate("/contentpage");
        toast.success("Login successful!", { position: "top-center" });
      } else {
        toast.warning(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container mb-5">
      <div className="form-container" style={{ height: "600" }}>
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
          <h3 className="register my-0">Welcome</h3>
          <p className="description">Login to your account.</p>

          <div className="form-group">
            <label htmlFor="email">Username or email address</label>
            <input
              type="email"
              className="form-control contentclass"
              id="email"
              placeholder="Enter your username or email address"
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
              Remember me
            </label>
          </div>
          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <p className="description mt-4">
            If you don't register please
            <span>
              {" "}
              <Link to="/signup">Signup</Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

// mongodb+srv://deepakgupta:itsmemongo@cluster0.awxlumf.mongodb.net/
