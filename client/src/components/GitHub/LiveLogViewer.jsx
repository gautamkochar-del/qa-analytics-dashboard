import React, { useState, useEffect, useRef } from "react";
import {
  Dialog, DialogTitle, DialogContent, Box, Typography, IconButton, TextField, InputAdornment, Button, Tooltip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import * as githubActionsApi from "../../api/githubActionsApi";
import AnsiToHtml from "ansi-to-html";
import DOMPurify from "dompurify";

const ansiConverter = new AnsiToHtml({
  escapeXML: true,
  newline: true,
  fg: "#FFF",
  bg: "#000",
});

export default function LiveLogViewer({ open, onClose, owner, repo, jobId, jobName, jobStatus }) {
  const [logs, setLogs] = useState("");
  const [search, setSearch] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    let intervalId = null;

    const fetchLogs = async () => {
      if (!owner || !repo || !jobId || !open) return;
      try {
        const rawLogs = await githubActionsApi.getJobLogs(owner, repo, jobId);
        setLogs(typeof rawLogs === 'string' ? rawLogs : "Waiting for logs...");
      } catch (err) {
        if (logs === "") {
          setLogs("Failed to load logs or logs expired.");
        }
      }
    };

    if (open) {
      setLogs("");
      fetchLogs();
      if (jobStatus === "in_progress" || jobStatus === "queued") {
        intervalId = setInterval(fetchLogs, 5000);
      }
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [open, owner, repo, jobId, jobStatus]);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const handleDownload = () => {
    const blob = new Blob([logs], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `job-${jobId}-logs.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFilteredLogsHTML = () => {
    if (!logs) return "<i>Waiting for logs...</i>";
    
    let html = ansiConverter.toHtml(logs);
    
    if (search.trim() !== "") {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedSearch})`, "gi");
      html = html.replace(regex, '<span style="background-color: #fde047; color: #000;">$1</span>');
    }
    
    return DOMPurify.sanitize(html);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth PaperProps={{ sx: { height: '90vh' } }}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "background.paper", pb: 1, borderBottom: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Logs: {jobName}
          </Typography>
          <TextField
            size="small"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
            }}
            sx={{ width: 250, ml: 2 }}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title={autoScroll ? "Disable Auto-Scroll" : "Enable Auto-Scroll"}>
            <Button
              variant={autoScroll ? "contained" : "outlined"}
              color="primary"
              size="small"
              onClick={() => setAutoScroll(!autoScroll)}
              startIcon={<VerticalAlignBottomIcon />}
            >
              Auto-Scroll
            </Button>
          </Tooltip>
          <Tooltip title="Download Logs">
            <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={handleDownload} disabled={!logs}>
              Download
            </Button>
          </Tooltip>
          <IconButton onClick={onClose} size="small" sx={{ ml: 2 }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, bgcolor: "#1e1e1e", color: "#d4d4d4", fontFamily: "monospace", overflow: "hidden" }}>
        <Box 
          ref={scrollRef}
          sx={{ 
            height: "100%", 
            width: "100%", 
            p: 2, 
            overflow: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
            fontSize: "0.85rem",
            lineHeight: 1.5,
          }}
          dangerouslySetInnerHTML={{ __html: getFilteredLogsHTML() }}
          onWheel={() => {
            if (autoScroll) setAutoScroll(false); // disable auto-scroll on manual scroll
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
