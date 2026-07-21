import React, { useState } from "react";
import { Box, Typography, Button, Card, Dialog, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function ScreenshotViewer({ testCase }) {
  const [openPreview, setOpenPreview] = useState(false);

  // If no screenshot is provided, we can either return early or use a mock placeholder if needed
  // For the requested format, let's assume if there's no screenshot, we still show the layout or a placeholder
  const imageUrl = testCase?.screenshot || "https://placehold.co/600x400?text=No+Screenshot";
  
  return (
    <Box sx={{ mt: 2 }}>
      <Card variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: "center" }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
          {testCase?.name ? `${testCase.name} Failure` : "Payment Failure"}
        </Typography>
        
        <Box 
          onClick={() => setOpenPreview(true)}
          sx={{ 
            cursor: "zoom-in", 
            border: "1px dashed", 
            borderColor: "divider", 
            borderRadius: 2,
            overflow: "hidden",
            "&:hover": { opacity: 0.8 }
          }}
        >
          <img 
            src={imageUrl} 
            alt="Test Failure Screenshot" 
            style={{ width: "100%", maxHeight: "300px", objectFit: "contain", display: "block" }} 
          />
        </Box>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Click the image to open a full-screen preview.
          </Typography>
        </Box>
      </Card>

      {/* Full-Screen Preview Modal */}
      <Dialog 
        open={openPreview} 
        onClose={() => setOpenPreview(false)}
        maxWidth="lg"
        fullWidth
      >
        <Box sx={{ position: "relative", bgcolor: "black", textAlign: "center", p: 2 }}>
          <IconButton 
            onClick={() => setOpenPreview(false)} 
            sx={{ position: "absolute", right: 8, top: 8, color: "white", bgcolor: "rgba(0,0,0,0.5)" }}
          >
            <CloseIcon />
          </IconButton>
          <img 
            src={imageUrl} 
            alt="Full Screen Preview" 
            style={{ width: "100%", maxHeight: "85vh", objectFit: "contain" }} 
          />
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              startIcon={<OpenInNewIcon />} 
              href={imageUrl} 
              target="_blank"
            >
              Open Original
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}
