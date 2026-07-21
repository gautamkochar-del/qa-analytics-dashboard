import { useState, useCallback } from "react";
import * as githubApi from "../api/githubApi";
import { useAppSnackbar } from "../context/SnackbarContext";

export default function useGitHub() {
  const { showSnackbar } = useAppSnackbar();
  const [isConnected, setIsConnected] = useState(false);
  const [profile, setProfile] = useState(null);
  const [repositories, setRepositories] = useState([]);
  
  // Repo specific data
  const [repoData, setRepoData] = useState({
    commits: [],
    pullRequests: [],
    issues: [],
    actions: [],
    languages: {},
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const status = await githubApi.getGitHubStatus();
      setIsConnected(status.isConnected);
      if (status.isConnected) {
        setProfile({
          username: status.username,
          avatar_url: status.avatar_url,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to check GitHub status");
    } finally {
      setLoading(false);
    }
  }, []);

  const connect = async (apiKey) => {
    setLoading(true);
    setError(null);
    try {
      const result = await githubApi.connectGitHub(apiKey);
      setIsConnected(true);
      setProfile(result.profile);
      showSnackbar("Successfully connected to GitHub", "success");
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to connect to GitHub";
      setError(errMsg);
      showSnackbar(errMsg, "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    setLoading(true);
    setError(null);
    try {
      await githubApi.disconnectGitHub();
      setIsConnected(false);
      setProfile(null);
      setRepositories([]);
      setRepoData({ commits: [], pullRequests: [], issues: [], actions: [], languages: {} });
      showSnackbar("Disconnected from GitHub", "info");
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to disconnect";
      setError(errMsg);
      showSnackbar(errMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchRepositories = async () => {
    setLoading(true);
    setError(null);
    try {
      const repos = await githubApi.getGitHubRepositories();
      setRepositories(repos);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to fetch repositories";
      setError(errMsg);
      showSnackbar(errMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchRepositoryData = async (owner, repo) => {
    setLoading(true);
    setError(null);
    try {
      const [commits, pullRequests, issues, actions, languages] = await Promise.all([
        githubApi.getGitHubCommits(owner, repo),
        githubApi.getGitHubPullRequests(owner, repo),
        githubApi.getGitHubIssues(owner, repo),
        githubApi.getGitHubActions(owner, repo),
        githubApi.getGitHubLanguages(owner, repo),
      ]);

      setRepoData({
        commits,
        pullRequests,
        issues,
        actions,
        languages,
      });
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to fetch repository data";
      setError(errMsg);
      showSnackbar(errMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const triggerAction = async (owner, repo, workflowId, ref = "main", inputs = {}) => {
    try {
      await githubApi.runGitHubAction({ owner, repo, workflowId, ref, inputs });
      showSnackbar(`Workflow '${workflowId}' dispatched successfully.`, "success");
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to trigger workflow";
      setError(errMsg);
      showSnackbar(errMsg, "error");
      return false;
    }
  };

  return {
    isConnected,
    profile,
    repositories,
    repoData,
    loading,
    error,
    checkStatus,
    connect,
    disconnect,
    fetchRepositories,
    fetchRepositoryData,
    triggerAction,
  };
}
