import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("qa_dash_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data);
      } catch (err) {
        console.error("Token verification failed:", err);
        localStorage.removeItem("qa_dash_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("qa_dash_token", data.token);
    setUser({
      id: data.id, name: data.name, email: data.email, role: data.role, });
    return data;
  };

  const register = async (name, email, password, role) => {
    const { data } = await api.post("/api/auth/register", {
      name, email, password, role, });
    localStorage.setItem("qa_dash_token", data.token);
    setUser({
      id: data.id, name: data.name, email: data.email, role: data.role, });
    return data;
  };

  const logout = () => {
    localStorage.removeItem("qa_dash_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user, loading, isAuthenticated: !!user, login, register, logout, }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
