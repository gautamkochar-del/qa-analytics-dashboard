import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box, Card, CardContent, Typography, TextField, Button, Alert, InputAdornment, IconButton, CircularProgress, } from "@mui/material";
import { Visibility, VisibilityOff, Lock, Mail } from "@mui/icons-material";
import { useAppSnackbar } from "../context/SnackbarContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const { showSnackbar } = useAppSnackbar();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      showSnackbar("Signed in successfully!", "success");
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid email or password");
      showSnackbar("Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", bgcolor: "background.default", }}
    >
      <Card
        sx={{
          maxWidth: 420, width: "100%", p: 2, borderRadius: 4, boxShadow: 3, }}
      >
        <CardContent>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 800 }}>
              QA<span style={{ color: "#10b981" }}>Dash</span>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to manage test suites, bug tracking, and reports
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail color="action" />
                  </InputAdornment>
                ), }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ), endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ), }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5, borderRadius: 2, fontSize: "1rem", fontWeight: 650, }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="caption" color="text.secondary">
              Default users: admin@company.com / password123
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
