import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Button, Grid, Card, CardContent, CardActions, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, CircularProgress, } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LinkIcon from "@mui/icons-material/Link";
import * as integrationApi from "../api/integrationApi";
import { useAppSnackbar } from "../context/SnackbarContext";

const INTEGRATION_PROVIDERS = [
  { id: "Jira", name: "Jira Software" }, { id: "GitHub", name: "GitHub Actions" }, { id: "Jenkins", name: "Jenkins CI" }, { id: "Azure DevOps", name: "Azure DevOps" }, { id: "GitLab CI", name: "GitLab CI" }, ];

const WEBHOOK_PATHS = {
  "GitHub": "github", "Jenkins": "jenkins", "Azure DevOps": "azure", "GitLab CI": "gitlab", };

export default function Integrations() {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useAppSnackbar();

  const [open, setOpen] = useState(false);
  const [selectedInt, setSelectedInt] = useState(null);
  const [form, setForm] = useState({
    provider: "Jira", name: "", url: "", apiKey: "", metadata: "", });

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      const data = await integrationApi.getIntegrations();
      setIntegrations(data);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to load integrations", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleOpen = (integration = null) => {
    if (integration) {
      setSelectedInt(integration);
      setForm({
        provider: integration.provider, name: integration.name, url: integration.url || "", apiKey: "", // Don't prefill API keys for security
        metadata: integration.metadata || "", });
    } else {
      setSelectedInt(null);
      setForm({
        provider: "Jira", name: "", url: "", apiKey: "", metadata: "", });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedInt(null);
  };

  const handleChange = (e) => {
    setForm({
      ...form, [e.target.name]: e.target.value, });
  };

  const handleSave = async () => {
    try {
      if (selectedInt) {
        await integrationApi.updateIntegration(selectedInt.id, form);
        showSnackbar("Integration updated successfully", "success");
      } else {
        await integrationApi.createIntegration(form);
        showSnackbar("Integration configured successfully", "success");
      }
      handleClose();
      fetchIntegrations();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to save integration", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this integration? This might break linked CI/CD pipelines or Jira ticket references.")) {
      try {
        await integrationApi.deleteIntegration(id);
        showSnackbar("Integration deleted", "success");
        fetchIntegrations();
      } catch (err) {
        console.error(err);
        showSnackbar("Failed to delete integration", "error");
      }
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          3rd Party Integrations
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ borderRadius: 2 }}
        >
          Add Integration
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      ) : integrations.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
          <Typography variant="h6" color="text.secondary">
            No integrations configured yet.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Connect Jira, GitHub, or Jenkins to automatically sync test runs and bugs.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {integrations.map((int) => (
            <Grid size={{xs: 12, sm: 6, md: 4}} key={int.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 3 }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {int.name}
                    </Typography>
                    <Chip
                      label={int.provider}
                      color={int.provider === "Jira" ? "primary" : int.provider === "Jenkins" ? "warning" : "default"}
                      size="small"
                    />
                  </Box>
                  {int.url && (
                    <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary", gap: 1, mb: 1 }}>
                      <LinkIcon fontSize="small" />
                      <Typography variant="body2" noWrap>
                        {int.url}
                      </Typography>
                    </Box>
                  )}
                  {int.provider !== "Jira" && (
                    <Box sx={{ mt: 2, p: 1.5, bgcolor: "background.default", borderRadius: 2 }}>
                      <Typography variant="caption" sx={{ display: "block", mb: 0.5, fontWeight: "bold" }}>
                        Webhook URL for Automated Import: </Typography>
                      <Typography variant="caption" sx={{ wordBreak: "break-all", fontFamily: "monospace", userSelect: "all" }}>
                        {window.location.origin}/api/webhooks/{WEBHOOK_PATHS[int.provider]}?apiKey=********
                      </Typography>
                    </Box>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
                    Configured by {int.user?.name}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end", p: 2, pt: 0 }}>
                  <IconButton size="small" color="primary" onClick={() => handleOpen(int)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(int.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Integration Form Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{selectedInt ? "Edit Integration" : "New Integration"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={12}>
              <TextField
                select
                fullWidth
                label="Provider"
                name="provider"
                value={form.provider}
                onChange={handleChange}
                disabled={!!selectedInt}
              >
                {INTEGRATION_PROVIDERS.map((provider) => (
                  <MenuItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Integration Name"
                name="name"
                placeholder="e.g., QA Team Jira"
                value={form.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Base URL"
                name="url"
                placeholder="e.g., https://yourdomain.atlassian.net"
                value={form.url}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label={selectedInt ? "Update API Token (leave blank to keep current)" : "API Token / Access Key"}
                name="apiKey"
                type="password"
                value={form.apiKey}
                onChange={handleChange}
                required={!selectedInt}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Additional Configuration (JSON)"
                name="metadata"
                multiline
                rows={3}
                placeholder='{"projectKey": "QA"}'
                value={form.metadata}
                onChange={handleChange}
                helperText="Optional JSON payload for provider-specific settings"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.name || (!form.apiKey && !selectedInt)}>
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
