import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { SnackbarProvider } from "./context/SnackbarContext";
import { SocketProvider } from "./context/SocketContext";
import GlobalSnackbar from "./components/Common/GlobalSnackbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles/dashboard.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <SocketProvider>
              <SnackbarProvider>
                <App />
                <GlobalSnackbar />
              </SnackbarProvider>
            </SocketProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
