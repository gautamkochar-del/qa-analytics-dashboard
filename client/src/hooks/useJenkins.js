import { useState, useCallback } from "react";
import api from "../api/axios";
import { useAppSnackbar } from "../context/SnackbarContext";

export default function useJenkins() {
  const { showSnackbar } = useAppSnackbar();
  
  const [status, setStatus] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [builds, setBuilds] = useState({}); // { jobName: [builds] }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkStatus = useCallback(async () => {
    try {
      const { data } = await api.get("/cicd/jenkins/status");
      setStatus(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/cicd/jenkins/jobs");
      setJobs(data);
    } catch (err) {
      setError("Failed to fetch Jenkins jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBuilds = useCallback(async (jobName) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/cicd/jenkins/jobs/${jobName}/builds`);
      setBuilds((prev) => ({ ...prev, [jobName]: data }));
    } catch (err) {
      setError(`Failed to fetch builds for ${jobName}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const triggerJob = async (jobName, params = {}) => {
    try {
      await api.post(`/cicd/jenkins/jobs/${jobName}/build`, params);
      showSnackbar(`Job ${jobName} triggered successfully`, "success");
      // Give Jenkins a second to process before refreshing
      setTimeout(() => fetchBuilds(jobName), 2000); 
    } catch (err) {
      showSnackbar(`Failed to trigger job ${jobName}`, "error");
    }
  };

  const getBuildLog = async (jobName, buildNumber) => {
    try {
      const { data } = await api.get(`/cicd/jenkins/jobs/${jobName}/builds/${buildNumber}/log`);
      return data;
    } catch (err) {
      return "Log not available or failed to load.";
    }
  };

  const getFailedStage = async (jobName, buildNumber) => {
    try {
      const { data } = await api.get(`/cicd/jenkins/jobs/${jobName}/builds/${buildNumber}/failed-stage`);
      return data;
    } catch (err) {
      return null;
    }
  };

  return {
    status,
    jobs,
    builds,
    loading,
    error,
    checkStatus,
    fetchJobs,
    fetchBuilds,
    triggerJob,
    getBuildLog,
    getFailedStage,
  };
}
