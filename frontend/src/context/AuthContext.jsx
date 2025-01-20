import { createContext, useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import apiService from "../api/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);

  // Centralized error handling function
  const handleError = (error) => {
    return error.response?.data?.message || "An error occurred";
  };

  // Login function
  const login = useCallback(async (email, password) => {
    try {
      const token = await apiService.login(email, password);
      localStorage.setItem("authToken", token);
    } catch (err) {
      setError(handleError(err));
      throw new Error();
    }
  }, []);

  // Signup function
  const signup = useCallback(async (userData) => {
    try {
      const token = await apiService.signup(userData);
      localStorage.setItem("authToken", token);
    } catch (err) {
      setError(handleError(err));
      throw new Error();
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await apiService.logout();
      }
      localStorage.removeItem("authToken");
    } catch (err) {
      setError(handleError(err));
      throw new Error();
    }
  }, []);

  const contextValue = useMemo(
    () => ({ login, signup, logout, error }),
    [error, login, signup, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// PropTypes validation for AuthProvider
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
