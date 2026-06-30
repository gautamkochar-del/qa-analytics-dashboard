import { createContext, useContext, useState, useCallback } from "react";

const SnackbarContext = createContext(null);

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false, message: "", severity: "success", // success, error, info, warning
  });

  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({
      open: true, message, severity, });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar((prev) => ({
      ...prev, open: false, }));
  }, []);

  return (
    <SnackbarContext.Provider value={{ snackbar, showSnackbar, closeSnackbar }}>
      {children}
    </SnackbarContext.Provider>
  );
};

export const useAppSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useAppSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
