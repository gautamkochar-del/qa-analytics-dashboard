import React from "react";
import { Box, Typography, Button } from "@mui/material";

export default function VideoViewer({ testCase }) {
  if (!testCase || !testCase.video) {
    return (
      <Box sx={{ p: 2, textAlign: "center", bgcolor: "background.default", borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">No video recording available.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <video controls style={{ maxWidth: "100%", borderRadius: "8px" }}>
        <source src={testCase.video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Box sx={{ mt: 1, textAlign: "center" }}>
        <Button variant="outlined" size="small" href={testCase.video} target="_blank">
          Open Video Tab
        </Button>
      </Box>
    </Box>
  );
}
