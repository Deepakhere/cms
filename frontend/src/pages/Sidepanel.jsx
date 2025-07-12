import React, { useState, useEffect } from "react";
import "./assests/sidepanel.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import apiService from "../services/api";

function Sidepanel() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isAuthenticated, user } = useAuth();
  const [userProfileImage, setUserProfileImage] = useState(null);
  const [isLoadingProfileImage, setIsLoadingProfileImage] = useState(false);

  // Helper function to check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Fetch user profile image from homepage data
  useEffect(() => {
    const fetchUserProfileImage = async () => {
      if (isAuthenticated && user) {
        setIsLoadingProfileImage(true);
        try {
          const response = await apiService.pages.getAll();
          const pages = response.data || [];

          // Find the first page with a file/image uploaded by the current user
          const userPageWithImage = pages.find(
            (page) =>
              page.files &&
              page.files.trim() !== "" &&
              (page.createdBy === user.name ||
                page.createdBy === user.email ||
                page.createdBy === user._id ||
                page.modifiedBy === user.name ||
                page.modifiedBy === user.email)
          );

          if (userPageWithImage && userPageWithImage.files) {
            setUserProfileImage(userPageWithImage.files);
          } else {
            setUserProfileImage(null);
          }
        } catch (error) {
          console.error("Error fetching user profile image:", error);
          setUserProfileImage(null);
        } finally {
          setIsLoadingProfileImage(false);
        }
      } else {
        setUserProfileImage(null);
        setIsLoadingProfileImage(false);
      }
    };

    fetchUserProfileImage();
  }, [isAuthenticated, user]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="landing-page">
      <div className="side-bar">
        <div className="navigation">
          {/* TOP SECTION - 3 Icons */}
          <div className="top-navigation">
            {/* 1. Logo with Home Link */}
            <div
              className={`svg-group ${
                isActive("/") ? "active" : "user-profile-section"
              }`}
            >
              <Link to="/" title="Published Pages">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke={isActive("/") ? "#4F46E5" : "#6C6B80"}
                    strokeWidth="2"
                  />
                  <path
                    d="M2 12H22"
                    stroke={isActive("/") ? "#4F46E5" : "#6C6B80"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
                    stroke={isActive("/") ? "#4F46E5" : "#6C6B80"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>

            {/* 2. Create Page Icon */}
            <div
              className={`svg-group ${
                isActive("/create-page") ? "active" : "user-profile-section"
              }`}
            >
              <Link
                to="/create-page"
                title="Create Page"
                className="profile-button"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                    stroke={isActive("/create-page") ? "#4F46E5" : "#6C6B80"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 2V8H20"
                    stroke={isActive("/create-page") ? "#4F46E5" : "#6C6B80"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 11V17"
                    stroke={isActive("/create-page") ? "#4F46E5" : "#6C6B80"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 14H15"
                    stroke={isActive("/create-page") ? "#4F46E5" : "#6C6B80"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>

            {/* 3. Pages/Book Icon */}
            <div
              className={`svg-group ${
                isActive("/contentpage") ? "active" : "user-profile-section"
              }`}
            >
              <Link
                to="/contentpage"
                title="All Pages"
                className="profile-button"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8"
                    stroke={isActive("/contentpage") ? "#4F46E5" : "#6C6B80"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="8"
                    y="2"
                    width="8"
                    height="4"
                    rx="1"
                    ry="1"
                    stroke={isActive("/contentpage") ? "#4F46E5" : "#6C6B80"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 10H16"
                    stroke={isActive("/contentpage") ? "#4F46E5" : "#6C6B80"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 14H13"
                    stroke={isActive("/contentpage") ? "#4F46E5" : "#6C6B80"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* BOTTOM SECTION - 3 Icons */}
          <div className="bottom-navigation">
            {/* 1. Notification Icon */}
            <div className="svg-group user-profile-section">
              <button title="Notifications" className="profile-button">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                    stroke="#6C6B80"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                    stroke="#6C6B80"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* 2. User Icon */}
            <div className="svg-group user-profile-section">
              <button title="Profile" className="profile-button">
                {isLoadingProfileImage ? (
                  <div className="profile-loading-spinner"></div>
                ) : userProfileImage ? (
                  <img
                    src={userProfileImage}
                    alt="User Profile"
                    className="user-profile-image"
                    onError={() => setUserProfileImage(null)}
                  />
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                      stroke="#6C6B80"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                      stroke="#6C6B80"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* 3. Logout Icon */}
            <div className="svg-group user-profile-section">
              <button
                title="Logout"
                className="profile-button"
                onClick={handleLogout}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                    stroke="#6C6B80"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 17L21 12L16 7"
                    stroke="#6C6B80"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 12H9"
                    stroke="#6C6B80"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidepanel;
