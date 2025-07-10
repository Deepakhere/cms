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

      if (response.data && response.data.valid) {
        setIsAuthenticated(true);
        setUser(response.data.user || null);
        console.log("✅ User authenticated:", response.data.user?.email);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        console.log("❌ User not authenticated");
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      // Only set to false if it's a real authentication failure, not a network error
      if (error.response && error.response.status === 401) {
        setIsAuthenticated(false);
        setUser(null);
      }
      // For network errors, keep current state to avoid unnecessary logouts
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log("🔐 Attempting login for:", email);
      const response = await apiService.auth.login({ email, password });

      console.log("📡 Login response:", response.data);

      if (response.data === "Success") {
        console.log("✅ Login successful, checking authentication...");
        setIsAuthenticated(true);
        // Fetch user data after successful login
        await checkAuthentication();
        return { success: true };
      } else {
        console.log("❌ Login failed:", response.data);
        return { success: false, message: response.data };
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      if (error.code === "ERR_NETWORK") {
        return {
          success: false,
          message: "Network error. Please check your connection.",
        };
      }
      return {
        success: false,
        message: error.response?.data || "Login failed. Please try again.",
      };
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
