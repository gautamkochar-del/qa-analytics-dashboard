import React from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

export default function TestResultTable({ filteredTestCases, selectedTestCase, setSelectedTestCase }) {
  const getStatusIcon = (status) => {
    if (status?.toLowerCase() === "passed") return <CheckCircleIcon color="success" />;
    if (status?.toLowerCase() === "failed") return <CancelIcon color="error" />;
    return <PlayCircleIcon color="disabled" />;
  };

  return (
    <List sx={{ maxHeight: 520, overflow: "auto" }}>
      {filteredTestCases.map(tc => (
        <ListItemButton 
          key={tc.id} 
          selected={selectedTestCase?.id === tc.id}
          onClick={() => setSelectedTestCase(tc)}
          sx={{ borderRadius: 2, mb: 0.5 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            {getStatusIcon(tc.status)}
          </ListItemIcon>
          <ListItemText 
            primary={tc.name} 
            primaryTypographyProps={{ fontWeight: 600, color: tc.status === "failed" ? "error.main" : "text.primary" }}
          />
        </ListItemButton>
      ))}
      {filteredTestCases.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
          No test cases found.
        </Typography>
      )}
    </List>
  );
}
