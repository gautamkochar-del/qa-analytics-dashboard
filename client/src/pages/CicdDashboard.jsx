import { useEffect, useState } from "react";
import { Box, Typography, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from "@mui/material";
import useJenkins from "../hooks/useJenkins";
import BuildCard from "../components/CICD/BuildCard";
import PipelineStatus from "../components/CICD/PipelineStatus";
import PipelineTimeline from "../components/CICD/PipelineTimeline";
import BuildHistory from "../components/CICD/BuildHistory";
import PipelineGraph from "../components/CICD/PipelineGraph";

export default function CicdDashboard() {
  const {
    status,
    jobs,
    builds,
    loading,
    checkStatus,
    fetchJobs,
    fetchBuilds,
    triggerJob,
    getBuildLog,
    getFailedStage
  } = useJenkins();

  const [selectedJob, setSelectedJob] = useState("");
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [activeLog, setActiveLog] = useState("");
  const [loadingLog, setLoadingLog] = useState(false);
  const [failedStageData, setFailedStageData] = useState(null);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  useEffect(() => {
    if (status?.isConnected) {
      fetchJobs();
    }
  }, [status?.isConnected, fetchJobs]);

  useEffect(() => {
    if (selectedJob) {
      fetchBuilds(selectedJob);
    }
  }, [selectedJob, fetchBuilds]);

  // When builds load, try to fetch the failed stage for the latest build if it failed
  useEffect(() => {
    const checkFailedStage = async () => {
      const jobBuilds = builds[selectedJob];
      if (jobBuilds && jobBuilds.length > 0) {
        const latestBuild = jobBuilds[0];
        if (latestBuild.status === "FAILURE") {
          const stage = await getFailedStage(selectedJob, latestBuild.number);
          setFailedStageData(stage);
        } else {
          setFailedStageData(null);
        }
      }
    };
    checkFailedStage();
  }, [builds, selectedJob, getFailedStage]);

  const handleViewLog = async (jobName, buildNumber) => {
    setLogDialogOpen(true);
    setLoadingLog(true);
    const log = await getBuildLog(jobName, buildNumber);
    setActiveLog(log);
    setLoadingLog(false);
  };

  const handleTrigger = (jobName) => {
    triggerJob(jobName);
  };

  if (status && !status.isConnected) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary">
          Jenkins is not connected.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Please go to the Integrations Settings to connect your Jenkins CI/CD pipeline.
        </Typography>
      </Box>
    );
  }

  const jobDetails = jobs.find(j => j.name === selectedJob);
  const jobBuilds = builds[selectedJob] || [];
  const latestBuild = jobBuilds[0];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Live Build Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor, trigger, and analyze Jenkins CI/CD pipelines in real-time.
          </Typography>
        </Box>

        <Box sx={{ minWidth: 250 }}>
          <TextField
            select
            fullWidth
            label="Select Jenkins Job"
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            disabled={loading || jobs.length === 0}
          >
            {jobs.map((job) => (
              <MenuItem key={job.name} value={job.name}>
                {job.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>

      {selectedJob && (
        <>
          <Grid container spacing={3}>
            <Grid size={{xs: 12, lg: 8}}>
              <BuildCard 
                job={jobDetails} 
                latestBuild={latestBuild} 
                onTrigger={handleTrigger}
                onViewLog={handleViewLog}
              />
              <PipelineGraph 
                failedStage={failedStageData} 
                latestBuildStatus={latestBuild?.status} 
              />
            </Grid>

            <Grid size={{xs: 12, lg: 4}}>
              <PipelineStatus builds={jobBuilds} />
              <PipelineTimeline 
                failedStage={failedStageData} 
                latestBuildStatus={latestBuild?.status}
              />
            </Grid>

            <Grid size={{xs: 12}}>
              <BuildHistory builds={jobBuilds} loading={loading} />
            </Grid>
          </Grid>
        </>
      )}

      {!selectedJob && jobs.length > 0 && (
        <Box sx={{ p: 6, textAlign: "center", bgcolor: "background.paper", borderRadius: 3 }}>
          <Typography variant="h6" color="text.secondary">
            Select a Jenkins job from the dropdown to view its live dashboard.
          </Typography>
        </Box>
      )}

      {/* Console Log Dialog */}
      <Dialog 
        open={logDialogOpen} 
        onClose={() => setLogDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Console Output</DialogTitle>
        <DialogContent dividers sx={{ bgcolor: "#1e1e1e", color: "#d4d4d4", fontFamily: "monospace", p: 3 }}>
          {loadingLog ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress color="inherit" />
            </Box>
          ) : (
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
              {activeLog || "No logs available."}
            </pre>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
