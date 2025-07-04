import React, { createContext, useContext, useState, useEffect } from "react";
import apiService from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const checkAuthentication = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.auth.isAuthenticated();

      if (response.data.valid) {
        setIsAuthenticated(true);
        setUser(response.data.user || null);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiService.auth.login({ email, password });

      if (response.data === "Success") {
        setIsAuthenticated(true);
        // Optionally fetch user data after successful login
        await checkAuthentication();
        return { success: true };
      } else {
        return { success: false, message: response.data };
      }
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, message: "Login failed. Please try again." };
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint if available
      await apiService.auth.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear local state even if logout request fails
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    checkAuthentication,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
