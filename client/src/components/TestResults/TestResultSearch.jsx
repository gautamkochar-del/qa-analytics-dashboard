import React from "react";
import { TextField } from "@mui/material";

export default function TestResultSearch({ searchTerm, setSearchTerm }) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      placeholder="Search Test Cases..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      sx={{ mb: 2 }}
    />
  );
}
