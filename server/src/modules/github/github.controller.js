import * as githubService from "./github.service.js";

export const getProfile = async (req, res) => {
  try {
    const profile = await githubService.getGitHubProfile(req.user.id);
    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRepositories = async (req, res) => {
  try {
    const repositories = await githubService.getGitHubRepositories(req.user.id);
    res.json(repositories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const connect = async (req, res) => {
  try {
    const { apiKey } = req.body;
    const result = await githubService.connectGitHub(req.user.id, apiKey);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const disconnect = async (req, res) => {
  try {
    const result = await githubService.disconnectGitHub(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getStatus = async (req, res) => {
  try {
    const status = await githubService.getGitHubStatus(req.user.id);
    res.json(status);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCommits = async (req, res) => {
  try {
    const { owner, repo } = req.query;
    const commits = await githubService.getGitHubCommits(req.user.id, owner, repo);
    res.json(commits);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPullRequests = async (req, res) => {
  try {
    const { owner, repo } = req.query;
    const prs = await githubService.getGitHubPullRequests(req.user.id, owner, repo);
    res.json(prs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getIssues = async (req, res) => {
  try {
    const { owner, repo } = req.query;
    const issues = await githubService.getGitHubIssues(req.user.id, owner, repo);
    res.json(issues);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getActions = async (req, res) => {
  try {
    const { owner, repo } = req.query;
    const actions = await githubService.getGitHubActions(req.user.id, owner, repo);
    res.json(actions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getLanguages = async (req, res) => {
  try {
    const { owner, repo } = req.query;
    const languages = await githubService.getGitHubLanguages(req.user.id, owner, repo);
    res.json(languages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const runAction = async (req, res) => {
  try {
    const { owner, repo, workflowId, ref, inputs } = req.body;
    const result = await githubService.triggerGitHubAction(req.user.id, owner, repo, workflowId, ref, inputs);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const webhookHandler = async (req, res) => {
  try {
    const { repository } = req.body;
    
    if (repository && repository.full_name) {
      const io = req.app.get("io");
      if (io) {
        // Broadcast to all connected clients that this specific repository needs a refresh
        io.emit("github-refresh", { repoFullName: repository.full_name });
      }
    }
    
    // Always respond 200 to GitHub to acknowledge receipt
    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
