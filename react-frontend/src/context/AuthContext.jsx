import { createContext, useCallback, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import apiService from "../api/authService";
import NotificationContext from "./NotificationContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { addNotification } = useContext(NotificationContext);

  // Login function
  const login = useCallback(
    async (email, password) => {
      try {
        const token = await apiService.login(email, password);
        localStorage.setItem("authToken", token);
      } catch (error) {
        const validationErrors = error?.response?.data?.errors;
        if (validationErrors?.length > 0) {
          validationErrors?.map((err) => {
            addNotification(err?.msg, "error");
          });
        } else {
          addNotification(
            error?.response?.data?.message ||
              error?.message ||
              "Oops, Something went wrong!",
            "error"
          );
        }
        throw new Error();
      }
    },
    [addNotification]
  );

  // Signup function
  const signup = useCallback(
    async (userData) => {
      try {
        const token = await apiService.signup(userData);
        localStorage.setItem("authToken", token);
      } catch (error) {
        const validationErrors = error?.response?.data?.errors;
        if (validationErrors?.length > 0) {
          validationErrors?.map((err) => {
            addNotification(err?.msg, "error");
          });
        } else {
          addNotification(
            error?.response?.data?.message ||
              error?.message ||
              "Oops, Something went wrong!",
            "error"
          );
        }
        throw new Error();
      }
    },
    [addNotification]
  );

  // Logout function
  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await apiService.logout();
      }
      localStorage.removeItem("authToken");
    } catch (error) {
      const validationErrors = error?.response?.data?.errors;
      if (validationErrors?.length > 0) {
        validationErrors?.map((err) => {
          addNotification(err?.msg, "error");
        });
      } else {
        addNotification(
          error?.response?.data?.message ||
            error?.message ||
            "Oops, Something went wrong!",
          "error"
        );
      }
      throw new Error();
    }
  }, [addNotification]);

  const contextValue = useMemo(
    () => ({ login, signup, logout }),
    [login, signup, logout]
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
