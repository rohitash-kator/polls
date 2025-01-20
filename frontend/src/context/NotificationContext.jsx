import { createContext, useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Snackbar, Alert } from "@mui/material";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Function to add a notification
  const addNotification = useCallback((message, type = "info") => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { message, type, id: Date.now() },
    ]);
  }, []);

  // Function to remove a notification by its ID
  const removeNotification = useCallback((id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  }, []);

  const contextValue = useMemo(
    () => ({ notifications, addNotification, removeNotification }),
    [notifications, addNotification, removeNotification]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      {/* Render notifications as Snackbars */}
      {notifications.map(({ id, message, type }) => (
        <Snackbar
          key={id}
          open={true}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={() => removeNotification(id)}
        >
          <Alert
            onClose={() => removeNotification(id)}
            severity={type} // type will be 'success', 'error', 'info', etc.
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
};

// PropTypes validation for NotificationProvider
NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NotificationContext;
