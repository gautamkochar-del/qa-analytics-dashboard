import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();
const GITHUB_API_URL = "https://api.github.com";

const getGitHubToken = async (userId) => {
  const integration = await prisma.integration.findFirst({
    where: {
      userId,
      provider: "GitHub",
      isActive: true,
    },
  });

  if (!integration) {
    throw new Error("GitHub is not connected.");
  }

  return integration.apiKey;
};

export const connectGitHub = async (userId, apiKey) => {
  try {
    const response = await axios.get(`${GITHUB_API_URL}/user`, {
      headers: {
        Authorization: `token ${apiKey}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const profileData = response.data;

    let integration = await prisma.integration.findFirst({
      where: { userId, provider: "GitHub" },
    });

    if (integration) {
      integration = await prisma.integration.update({
        where: { id: integration.id },
        data: {
          apiKey,
          isActive: true,
          metadata: JSON.stringify({
            username: profileData.login,
            avatar_url: profileData.avatar_url,
          }),
        },
      });
    } else {
      integration = await prisma.integration.create({
        data: {
          userId,
          provider: "GitHub",
          name: "GitHub Connection",
          url: "https://github.com",
          apiKey,
          isActive: true,
          metadata: JSON.stringify({
            username: profileData.login,
            avatar_url: profileData.avatar_url,
          }),
        },
      });
    }

    return {
      message: "GitHub connected successfully",
      profile: {
        username: profileData.login,
        name: profileData.name,
        avatar_url: profileData.avatar_url,
        url: profileData.html_url,
      },
    };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Invalid GitHub Personal Access Token.");
    }
    throw new Error("Failed to connect to GitHub: " + error.message);
  }
};

export const disconnectGitHub = async (userId) => {
  const integration = await prisma.integration.findFirst({
    where: { userId, provider: "GitHub" },
  });

  if (!integration) {
    throw new Error("GitHub is not connected.");
  }

  await prisma.integration.update({
    where: { id: integration.id },
    data: { isActive: false, apiKey: "" },
  });

  return { message: "GitHub disconnected successfully" };
};

export const getGitHubProfile = async (userId) => {
  const token = await getGitHubToken(userId);

  try {
    const response = await axios.get(`${GITHUB_API_URL}/user`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch GitHub profile.");
  }
};

export const getGitHubRepositories = async (userId) => {
  const token = await getGitHubToken(userId);

  try {
    const response = await axios.get(`${GITHUB_API_URL}/user/repos?sort=updated&per_page=100`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    return response.data.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      private: repo.private,
      url: repo.html_url,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      issues: repo.open_issues_count,
      watchers: repo.watchers_count,
    }));
  } catch (error) {
    throw new Error("Failed to fetch GitHub repositories.");
  }
};

export const getGitHubStatus = async (userId) => {
  const integration = await prisma.integration.findFirst({
    where: {
      userId,
      provider: "GitHub",
    },
  });

  if (!integration || !integration.isActive) {
    return { isConnected: false };
  }

  let metadata = {};
  try {
    metadata = JSON.parse(integration.metadata || "{}");
  } catch (err) {}

  return {
    isConnected: true,
    username: metadata.username,
    avatar_url: metadata.avatar_url,
  };
};

export const getGitHubCommits = async (userId, owner, repo) => {
  const token = await getGitHubToken(userId);
  if (!owner || !repo) throw new Error("Owner and repo are required.");

  try {
    const response = await axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/commits?per_page=20`, {
      headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" },
    });
    return response.data.map(commit => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author.name,
      date: commit.commit.author.date,
      url: commit.html_url,
    }));
  } catch (error) {
    throw new Error("Failed to fetch GitHub commits.");
  }
};

export const getGitHubPullRequests = async (userId, owner, repo) => {
  const token = await getGitHubToken(userId);
  if (!owner || !repo) throw new Error("Owner and repo are required.");

  try {
    const response = await axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/pulls?state=all&per_page=20`, {
      headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" },
    });
    return response.data.map(pr => ({
      id: pr.id,
      number: pr.number,
      title: pr.title,
      state: pr.state,
      author: pr.user.login,
      createdAt: pr.created_at,
      updatedAt: pr.updated_at,
      url: pr.html_url,
    }));
  } catch (error) {
    throw new Error("Failed to fetch GitHub pull requests.");
  }
};

export const getGitHubIssues = async (userId, owner, repo) => {
  const token = await getGitHubToken(userId);
  if (!owner || !repo) throw new Error("Owner and repo are required.");

  try {
    const response = await axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/issues?state=all&per_page=20`, {
      headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" },
    });
    // GitHub API returns PRs as issues too, filter them out if needed, but returning as is for now
    return response.data.filter(issue => !issue.pull_request).map(issue => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      state: issue.state,
      author: issue.user.login,
      createdAt: issue.created_at,
      url: issue.html_url,
      labels: issue.labels.map(l => l.name),
    }));
  } catch (error) {
    throw new Error("Failed to fetch GitHub issues.");
  }
};

export const getGitHubActions = async (userId, owner, repo) => {
  const token = await getGitHubToken(userId);
  if (!owner || !repo) throw new Error("Owner and repo are required.");

  try {
    const response = await axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/actions/runs?per_page=20`, {
      headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" },
    });
    return response.data.workflow_runs.map(run => ({
      id: run.id,
      name: run.name,
      status: run.status,
      conclusion: run.conclusion,
      headBranch: run.head_branch,
      createdAt: run.created_at,
      url: run.html_url,
    }));
  } catch (error) {
    throw new Error("Failed to fetch GitHub actions.");
  }
};

export const getGitHubLanguages = async (userId, owner, repo) => {
  const token = await getGitHubToken(userId);
  if (!owner || !repo) throw new Error("Owner and repo are required.");

  try {
    const response = await axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/languages`, {
      headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" },
    });
    return response.data; // Returns an object { "JavaScript": 12345, "HTML": 123 }
  } catch (error) {
    throw new Error("Failed to fetch GitHub languages.");
  }
};

export const triggerGitHubAction = async (userId, owner, repo, workflowId, ref = "main", inputs = {}) => {
  const token = await getGitHubToken(userId);
  if (!owner || !repo || !workflowId) throw new Error("Owner, repo, and workflowId are required.");

  try {
    const response = await axios.post(
      `${GITHUB_API_URL}/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`,
      { ref, inputs },
      { headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" } }
    );
    
    // GitHub API returns 204 No Content for successful dispatches
    if (response.status === 204) {
      return { message: "Workflow dispatched successfully." };
    }
    
    throw new Error("Failed to dispatch workflow.");
  } catch (error) {
    throw new Error("Failed to trigger GitHub action: " + (error.response?.data?.message || error.message));
  }
};
