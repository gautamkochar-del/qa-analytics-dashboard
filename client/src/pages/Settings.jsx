import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Switch,
  FormGroup,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  MenuItem,
  Grid,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import SecurityIcon from "@mui/icons-material/Security";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import { useAppSnackbar } from "../context/SnackbarContext";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Settings() {
  const { showSnackbar } = useAppSnackbar();
  const [tabIndex, setTabIndex] = useState(0);

  // Form states
  const [general, setGeneral] = useState({
    theme: "Light",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    defaultProject: "All",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    slackAlerts: false,
    notifyOnFailure: true,
    dailyDigest: false,
  });

  const [integrations, setIntegrations] = useState({
    jiraUrl: "https://jira.company.com",
    webhookUrl: "",
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: false,
    sessionTimeout: "30",
  });

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleSave = () => {
    // In a real app, this would dispatch an API request
    showSnackbar("Settings saved successfully!", "success");
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your personal preferences, notifications, and security.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          size="large"
          sx={{ borderRadius: 2, px: 4 }}
        >
          Save Changes
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            aria-label="settings tabs"
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab icon={<SettingsIcon />} iconPosition="start" label="General" />
            <Tab icon={<NotificationsIcon />} iconPosition="start" label="Notifications" />
            <Tab icon={<SettingsInputComponentIcon />} iconPosition="start" label="Integrations" />
            <Tab icon={<SecurityIcon />} iconPosition="start" label="Security" />
          </Tabs>
        </Box>

        <Box sx={{ minHeight: 400, bgcolor: "background.paper" }}>
          {/* General Tab */}
          <TabPanel value={tabIndex} index={0}>
            <Grid container spacing={4} maxWidth="md">
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="UI Theme"
                  value={general.theme}
                  onChange={(e) => setGeneral({ ...general, theme: e.target.value })}
                >
                  <MenuItem value="Light">Light Mode</MenuItem>
                  <MenuItem value="Dark">Dark Mode</MenuItem>
                  <MenuItem value="System">System Default</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Timezone"
                  value={general.timezone}
                  onChange={(e) => setGeneral({ ...general, timezone: e.target.value })}
                >
                  <MenuItem value="UTC">UTC (Coordinated Universal Time)</MenuItem>
                  <MenuItem value="America/New_York">EST (Eastern Standard Time)</MenuItem>
                  <MenuItem value="America/Los_Angeles">PST (Pacific Standard Time)</MenuItem>
                  <MenuItem value="Asia/Kolkata">IST (Indian Standard Time)</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Date Format"
                  value={general.dateFormat}
                  onChange={(e) => setGeneral({ ...general, dateFormat: e.target.value })}
                >
                  <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                  <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                  <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Default Project Filter"
                  value={general.defaultProject}
                  onChange={(e) => setGeneral({ ...general, defaultProject: e.target.value })}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Notifications Tab */}
          <TabPanel value={tabIndex} index={1}>
            <Box maxWidth="sm">
              <Typography variant="h6" gutterBottom>
                Alert Preferences
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Control what system events trigger notifications to your personal channels.
              </Typography>
              
              <FormGroup sx={{ gap: 2, mt: 3 }}>
                <FormControlLabel
                  control={<Switch checked={notifications.emailAlerts} onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })} />}
                  label="Email Alerts"
                />
                <FormControlLabel
                  control={<Switch checked={notifications.slackAlerts} onChange={(e) => setNotifications({ ...notifications, slackAlerts: e.target.checked })} />}
                  label="Slack / Microsoft Teams Integration"
                />
                <Divider sx={{ my: 1 }} />
                <FormControlLabel
                  control={<Switch checked={notifications.notifyOnFailure} onChange={(e) => setNotifications({ ...notifications, notifyOnFailure: e.target.checked })} />}
                  label="Notify Immediately on Test Suite Failure"
                />
                <FormControlLabel
                  control={<Switch checked={notifications.dailyDigest} onChange={(e) => setNotifications({ ...notifications, dailyDigest: e.target.checked })} />}
                  label="Receive Daily Executive Digest"
                />
              </FormGroup>
            </Box>
          </TabPanel>

          {/* Integrations Tab */}
          <TabPanel value={tabIndex} index={2}>
            <Box maxWidth="md">
              <Typography variant="h6" gutterBottom>
                External Services
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Configure endpoints for automated bug tracking and continuous integration tools.
              </Typography>
              
              <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  fullWidth
                  label="Jira Workspace URL"
                  variant="outlined"
                  value={integrations.jiraUrl}
                  onChange={(e) => setIntegrations({ ...integrations, jiraUrl: e.target.value })}
                  helperText="Format: https://your-domain.atlassian.net"
                />
                <TextField
                  fullWidth
                  label="CI/CD Webhook URL (Jenkins/GitHub Actions)"
                  variant="outlined"
                  value={integrations.webhookUrl}
                  onChange={(e) => setIntegrations({ ...integrations, webhookUrl: e.target.value })}
                  placeholder="https://ci.your-domain.com/generic-webhook-trigger/invoke"
                />
                <Box>
                  <Button variant="outlined" color="primary">
                    Generate New API Key
                  </Button>
                </Box>
              </Box>
            </Box>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel value={tabIndex} index={3}>
            <Grid container spacing={4} maxWidth="md">
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Change Password
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                  <TextField
                    type="password"
                    label="Current Password"
                    fullWidth
                    value={security.currentPassword}
                    onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                  />
                  <TextField
                    type="password"
                    label="New Password"
                    fullWidth
                    value={security.newPassword}
                    onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                  />
                  <TextField
                    type="password"
                    label="Confirm New Password"
                    fullWidth
                    value={security.confirmPassword}
                    onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                  />
                  <Button variant="outlined" sx={{ alignSelf: "flex-start", mt: 1 }}>
                    Update Password
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Security Preferences
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <FormGroup>
                    <FormControlLabel
                      control={<Switch checked={security.twoFactorAuth} onChange={(e) => setSecurity({ ...security, twoFactorAuth: e.target.checked })} />}
                      label="Enable Two-Factor Authentication (2FA)"
                    />
                  </FormGroup>
                  
                  <TextField
                    select
                    fullWidth
                    label="Idle Session Timeout"
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                    sx={{ mt: 3 }}
                  >
                    <MenuItem value="15">15 Minutes</MenuItem>
                    <MenuItem value="30">30 Minutes</MenuItem>
                    <MenuItem value="60">1 Hour</MenuItem>
                    <MenuItem value="0">Never</MenuItem>
                  </TextField>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
}
