import * as cicdService from "./cicd.service.js";

export const connect = async (req, res) => {
  try {
    const { url, username, apiKey } = req.body;
    if (!url || !username || !apiKey) {
      return res.status(400).json({ message: "URL, Username, and API Token are required." });
    }
    const result = await cicdService.connectJenkins(req.user.id, url, username, apiKey);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const disconnect = async (req, res) => {
  try {
    const result = await cicdService.disconnectJenkins(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getStatus = async (req, res) => {
  try {
    const status = await cicdService.getJenkinsStatus(req.user.id);
    res.json(status);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await cicdService.getJenkinsJobs(req.user.id);
    res.json(jobs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getBuilds = async (req, res) => {
  try {
    const { jobName } = req.params;
    const builds = await cicdService.getJenkinsBuilds(req.user.id, jobName);
    res.json(builds);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getBuildLog = async (req, res) => {
  try {
    const { jobName, buildNumber } = req.params;
    const log = await cicdService.getJenkinsBuildLog(req.user.id, jobName, buildNumber);
    res.send(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const triggerJob = async (req, res) => {
  try {
    const { jobName } = req.params;
    const parameters = req.body; // e.g., { BRANCH_NAME: "main" }
    const result = await cicdService.triggerJenkinsJob(req.user.id, jobName, parameters);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getFailedStage = async (req, res) => {
  try {
    const { jobName, buildNumber } = req.params;
    const failedStage = await cicdService.getJenkinsFailedStage(req.user.id, jobName, buildNumber);
    res.json(failedStage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const linkBuild = async (req, res) => {
  try {
    const { testRunId, buildUrl } = req.body;
    if (!testRunId || !buildUrl) {
      return res.status(400).json({ message: "testRunId and buildUrl are required." });
    }
    const result = await cicdService.linkBuildToTestRun(testRunId, buildUrl);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
