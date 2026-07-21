import { useState } from "react";
import { Box, Card, CardContent, Typography, TextField, Button, Avatar, CircularProgress, Divider } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkOffIcon from "@mui/icons-material/LinkOff";

export default function GitHubConnectionCard({ isConnected, profile, onConnect, onDisconnect, loading }) {
  const [apiKey, setApiKey] = useState("");

  const handleConnect = () => {
    if (apiKey.trim()) {
      onConnect(apiKey.trim());
    }
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <GitHubIcon sx={{ fontSize: 40, color: isConnected ? "text.primary" : "text.secondary" }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              GitHub Integration
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isConnected ? "Connected to your GitHub account" : "Link your account using a Personal Access Token"}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : isConnected && profile ? (
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar src={profile.avatar_url} alt={profile.username} sx={{ width: 56, height: 56 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  @{profile.username}
                </Typography>
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                  Active Connection
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              color="error"
              startIcon={<LinkOffIcon />}
              onClick={onDisconnect}
              sx={{ borderRadius: 2 }}
            >
              Disconnect
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
            <TextField
              fullWidth
              size="small"
              type="password"
              label="Personal Access Token"
              variant="outlined"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              helperText="Requires 'repo' scope access."
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleConnect}
              disabled={!apiKey.trim()}
              sx={{ borderRadius: 2, height: 40, px: 4 }}
            >
              Connect
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
