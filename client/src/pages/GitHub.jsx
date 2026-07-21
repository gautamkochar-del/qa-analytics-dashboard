import { useEffect, useState } from "react";
import { Box, Typography, Grid, CircularProgress, MenuItem, TextField } from "@mui/material";
import useGitHub from "../hooks/useGitHub";
import GitHubConnectionCard from "../components/GitHub/GitHubConnectionCard";
import RepositoryOverview from "../components/GitHub/RepositoryOverview";
import CommitList from "../components/GitHub/CommitList";
import PullRequestTable from "../components/GitHub/PullRequestTable";
import WorkflowTable from "../components/GitHub/WorkflowTable";
import IssueTable from "../components/GitHub/IssueTable";
import CommitActivityChart from "../components/GitHub/Charts/CommitActivityChart";
import PRTrendChart from "../components/GitHub/Charts/PRTrendChart";
import ContributorsChart from "../components/GitHub/Charts/ContributorsChart";
import LanguagesPieChart from "../components/GitHub/Charts/LanguagesPieChart";
import { useSocket } from "../context/SocketContext";

export default function GitHub() {
  const {
    isConnected,
    profile,
    repositories,
    repoData,
    loading,
    checkStatus,
    connect,
    disconnect,
    fetchRepositories,
    fetchRepositoryData,
    triggerAction,
  } = useGitHub();

  const { socket } = useSocket();

  const [selectedRepoFullName, setSelectedRepoFullName] = useState("");

  // Check connection status on mount
  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // When connection status becomes true, fetch repositories
  useEffect(() => {
    if (isConnected) {
      fetchRepositories();
    }
  }, [isConnected]);

  // When a repository is selected, fetch its specific data
  useEffect(() => {
    if (selectedRepoFullName) {
      const [owner, repo] = selectedRepoFullName.split("/");
      if (owner && repo) {
        fetchRepositoryData(owner, repo);
      }
    }
  }, [selectedRepoFullName]);

  // Socket auto-refresh
  useEffect(() => {
    if (!socket || !selectedRepoFullName) return;

    const handleRefresh = (data) => {
      // Refresh if the event is global or targets the selected repo
      if (!data || (data.repoFullName && data.repoFullName === selectedRepoFullName)) {
        const [owner, repo] = selectedRepoFullName.split("/");
        fetchRepositoryData(owner, repo);
      }
    };

    socket.on("github-refresh", handleRefresh);

    return () => {
      socket.off("github-refresh", handleRefresh);
    };
  }, [socket, selectedRepoFullName]);

  const selectedRepoDetails = repositories.find((r) => r.fullName === selectedRepoFullName);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          GitHub Integration
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Connect your GitHub account and view repository data directly in QADash.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{xs: 12, md: 6}}>
          <GitHubConnectionCard
            isConnected={isConnected}
            profile={profile}
            onConnect={connect}
            onDisconnect={disconnect}
            loading={loading && !repositories.length}
          />
        </Grid>

        {isConnected && (
          <Grid size={{xs: 12, md: 6}}>
            <Box sx={{ p: 3, bgcolor: "background.paper", borderRadius: 3, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Select Repository
              </Typography>
              <TextField
                select
                fullWidth
                label="Repository"
                value={selectedRepoFullName}
                onChange={(e) => setSelectedRepoFullName(e.target.value)}
                disabled={loading || repositories.length === 0}
                helperText={repositories.length === 0 && !loading ? "No repositories found." : ""}
              >
                {repositories.map((repo) => (
                  <MenuItem key={repo.id} value={repo.fullName}>
                    {repo.fullName} {repo.private ? "(Private)" : ""}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>
        )}
      </Grid>

      {isConnected && selectedRepoDetails && (
        <Grid container spacing={3}>
          <Grid size={{xs: 12}}>
            <RepositoryOverview repository={selectedRepoDetails} />
          </Grid>

          <Grid size={{xs: 12}}>
            <CommitActivityChart commits={repoData.commits} />
          </Grid>

          <Grid size={{xs: 12}}>
            <ContributorsChart commits={repoData.commits} />
          </Grid>

          <Grid size={{xs: 12}}>
            <LanguagesPieChart languages={repoData.languages} />
          </Grid>

          <Grid size={{xs: 12}}>
            <CommitList commits={repoData.commits} loading={loading} />
          </Grid>

          <Grid size={{xs: 12}}>
            <PullRequestTable pullRequests={repoData.pullRequests} loading={loading} />
          </Grid>
          
          <Grid size={{xs: 12}}>
            <WorkflowTable 
              actions={repoData.actions} 
              loading={loading} 
              triggerAction={triggerAction}
              selectedRepoFullName={selectedRepoFullName}
            />
          </Grid>

          <Grid size={{xs: 12}}>
            <IssueTable issues={repoData.issues} loading={loading} />
          </Grid>
        </Grid>
      )}

      {isConnected && !selectedRepoFullName && !loading && (
        <Box sx={{ p: 4, textAlign: "center", bgcolor: "background.paper", borderRadius: 3 }}>
          <Typography variant="body1" color="text.secondary">
            Select a repository from the dropdown to view its analytics, commits, PRs, and CI/CD pipelines.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
