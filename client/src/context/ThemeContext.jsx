import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeModeContext = createContext({
  mode: "light", toggleTheme: () => {}, });

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  useEffect(() => {
    const savedMode = localStorage.getItem("qa_dash_theme");
    if (savedMode) {
      setMode(savedMode);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setMode(prefersDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("qa_dash_theme", newMode);
      return newMode;
    });
  };

  const themeConfig = useMemo(
    () =>
      createTheme({
        palette: {
          mode, primary: {
            main: mode === "light" ? "#2563eb" : "#3b82f6", // Premium cobalt blue
            light: mode === "light" ? "#60a5fa" : "#1d4ed8", dark: mode === "light" ? "#1d4ed8" : "#60a5fa", }, secondary: {
            main: "#10b981", // vibrant emerald
          }, background: {
            default: mode === "light" ? "#f8fafc" : "#0f172a", // cool slate-50 / slate-900
            paper: mode === "light" ? "#ffffff" : "#1e293b", // white / slate-800
          }, text: {
            primary: mode === "light" ? "#0f172a" : "#f8fafc", secondary: mode === "light" ? "#475569" : "#cbd5e1", }, divider: mode === "light" ? "#e2e8f0" : "#334155", }, typography: {
          fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif", h4: {
            fontWeight: 700, letterSpacing: "-0.02em", }, h6: {
            fontWeight: 600, letterSpacing: "-0.01em", }, button: {
            textTransform: "none", fontWeight: 500, }, }, shape: {
          borderRadius: 12, }, components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none", boxShadow: mode === "light"
                    ? "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)"
                    : "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)", border: mode === "light" ? "1px solid #e2e8f0" : "1px solid #334155", }, }, }, MuiButton: {
            styleOverrides: {
              contained: {
                boxShadow: "none", "&:hover": {
                  boxShadow: "none", }, }, }, }, }, }), [mode]
  );

  return (
    <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={themeConfig}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeModeContext);
