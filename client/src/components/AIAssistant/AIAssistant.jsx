import React, { useState } from 'react';
import { Fab, Drawer, Box, Typography, TextField, IconButton, Paper, Avatar, Chip } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const predefinedPrompts = [
  "Why did pass rate decrease?",
  "Show failed API tests.",
  "Generate regression summary.",
  "Which project has most bugs?",
  "Predict sprint completion."
];

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your QA Analytics AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (text) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInput('');
    
    // Mock LLM response
    setTimeout(() => {
      let response = "I'm analyzing the data to answer your question...";
      if (text.includes("pass rate")) response = "The pass rate decreased by 4.2% primarily due to 18 new failures in the Core API authentication suite introduced in the last deployment.";
      if (text.includes("failed API")) response = "There are 12 failed API tests currently. The most critical failure is 'POST /users/auth - returns 500' in the Mobile Backend project.";
      if (text.includes("regression")) response = "The latest Regression Suite execution completed in 45m 12s. 1245 tests passed, 14 failed, and 2 were skipped. Stability is currently at 98.8%.";
      if (text.includes("most bugs")) response = "The 'Payments Gateway Refactor' project currently has the highest bug count with 24 open defects, 5 of which are Critical severity.";
      if (text.includes("Predict")) response = "Based on current velocity (342 executions/week) and burn-down rate, Sprint 18 has an 87% probability of completing all planned automated coverage tasks on time.";
      
      setMessages(prev => [...prev, { sender: 'ai', text: response }]);
    }, 1000);
  };

  return (
    <>
      <Fab 
        color="primary" 
        sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)' }}
        onClick={() => setOpen(true)}
      >
        <AutoAwesomeIcon />
      </Fab>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: { xs: '100vw', sm: 400 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AutoAwesomeIcon />
              <Typography variant="h6" fontWeight="700">QA Copilot</Typography>
            </Box>
            <IconButton color="inherit" onClick={() => setOpen(false)}><CloseIcon /></IconButton>
          </Box>

          <Box sx={{ flex: 1, p: 2, overflowY: 'auto', bgcolor: 'background.default', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {messages.map((msg, idx) => (
              <Box key={idx} sx={{ display: 'flex', gap: 1, alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                {msg.sender === 'ai' && (
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}><SmartToyIcon fontSize="small" /></Avatar>
                )}
                <Paper sx={{ p: 1.5, borderRadius: 2, bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.paper', color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary', borderBottomRightRadius: msg.sender === 'user' ? 4 : 16, borderBottomLeftRadius: msg.sender === 'ai' ? 4 : 16 }}>
                  <Typography variant="body2">{msg.text}</Typography>
                </Paper>
              </Box>
            ))}
          </Box>

          <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {predefinedPrompts.map((prompt, idx) => (
                <Chip key={idx} label={prompt} size="small" onClick={() => handleSend(prompt)} sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' } }} />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField 
                fullWidth 
                size="small" 
                placeholder="Ask anything about your QA data..." 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
              />
              <IconButton color="primary" onClick={() => handleSend(input)}>
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
