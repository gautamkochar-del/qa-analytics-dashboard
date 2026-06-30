import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, } from "@mui/material";
import api from "../../api/axios";
import { useAppSnackbar } from "../../context/SnackbarContext";

export default function ScheduleReportDialog({ open, onClose }) {
  const { showSnackbar } = useAppSnackbar();
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [emails, setEmails] = useState("");

  const handleSubmit = async () => {
    try {
      const emailList = emails.split(",").map((e) => e.trim()).filter(Boolean);
      await api.post("/report-schedules", {
        name, frequency, recipients: emailList, });
      showSnackbar("Report scheduled successfully", "success");
      onClose();
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Failed to schedule report", "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Schedule Automated Report</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          label="Schedule Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormControl fullWidth>
          <InputLabel>Frequency</InputLabel>
          <Select
            value={frequency}
            label="Frequency"
            onChange={(e) => setFrequency(e.target.value)}
          >
            <MenuItem value="daily">Daily (8:00 AM)</MenuItem>
            <MenuItem value="weekly">Weekly (Monday 8:00 AM)</MenuItem>
            <MenuItem value="monthly">Monthly (1st of Month 8:00 AM)</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Recipients (comma separated emails)"
          fullWidth
          multiline
          rows={3}
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!name || !emails}>
          Save Schedule
        </Button>
      </DialogActions>
    </Dialog>
  );
}
