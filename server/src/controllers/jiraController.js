import axios from "axios";
import prisma from "../config/prisma.js";

const getJiraConfig = async (userId) => {
  const integration = await prisma.integration.findFirst({
    where: {
      provider: "Jira",
      isActive: true,
    },
  });

  if (!integration) {
    throw new Error("Jira integration is not configured or is inactive.");
  }

  let metadata = {};
  try {
    if (integration.metadata) {
      metadata = JSON.parse(integration.metadata);
    }
  } catch (e) {
    console.error("Failed to parse Jira metadata", e);
  }

  return {
    url: integration.url?.replace(/\/$/, ""), // Remove trailing slash
    apiKey: integration.apiKey, // Format: email:api_token
    projectKey: metadata.projectKey, // Optional project key
    username: metadata.username, // Sometimes stored here
  };
};

export const syncBugs = async (req, res) => {
  try {
    const config = await getJiraConfig(req.user.id);
    if (!config.url || !config.apiKey) {
      return res.status(400).json({ message: "Jira URL or API token missing in integration settings." });
    }

    // Usually Jira Basic Auth is Base64(email:token)
    // If apiKey doesn't have a colon, we assume they might have stored it as just the token and username separately in metadata
    let authString = config.apiKey;
    if (!authString.includes(":") && config.username) {
      authString = `${config.username}:${config.apiKey}`;
    }

    const jql = config.projectKey ? `project=${config.projectKey} AND issuetype=Bug` : `issuetype=Bug`;

    const response = await axios.get(`${config.url}/rest/api/2/search`, {
      params: {
        jql,
        maxResults: 50, // Limit for now
        fields: "summary,description,status,priority,assignee",
      },
      headers: {
        Authorization: `Basic ${Buffer.from(authString).toString("base64")}`,
        Accept: "application/json",
      },
    });

    const issues = response.data.issues || [];

    // Find the default project to attach these bugs to, or skip if no projects exist
    const defaultProject = await prisma.project.findFirst();
    if (!defaultProject) {
      return res.status(400).json({ message: "No local projects exist to link synced bugs." });
    }

    let syncedCount = 0;

    for (const issue of issues) {
      const jiraKey = issue.key;
      const title = issue.fields.summary;
      const desc = issue.fields.description || "";
      const statusName = issue.fields.status?.name || "Open";
      // Map Jira status to our basic "Open", "In Progress", "Resolved", "Closed"
      let localStatus = "Open";
      if (statusName.toLowerCase().includes("progress")) localStatus = "In Progress";
      if (statusName.toLowerCase().includes("done") || statusName.toLowerCase().includes("resolv")) localStatus = "Resolved";
      if (statusName.toLowerCase().includes("clos")) localStatus = "Closed";

      const priorityName = issue.fields.priority?.name || "Medium";
      let localSeverity = "Medium";
      if (priorityName.toLowerCase().includes("high") || priorityName.toLowerCase().includes("crit")) localSeverity = "High";
      if (priorityName.toLowerCase().includes("low") || priorityName.toLowerCase().includes("minor")) localSeverity = "Low";

      // Upsert into local DB
      const existingBug = await prisma.bug.findFirst({
        where: { jiraIssueKey: jiraKey },
      });

      if (existingBug) {
        await prisma.bug.update({
          where: { id: existingBug.id },
          data: {
            title,
            description: desc,
            status: localStatus,
            severity: localSeverity,
          },
        });
      } else {
        await prisma.bug.create({
          data: {
            title,
            description: desc,
            status: localStatus,
            severity: localSeverity,
            projectId: defaultProject.id,
            jiraIssueKey: jiraKey,
            module: "Synced from Jira",
          },
        });
      }
      syncedCount++;
    }

    res.json({ message: `Successfully synced ${syncedCount} bugs from Jira.`, count: syncedCount });
  } catch (error) {
    console.error("Jira Sync Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to sync with Jira", error: error.message });
  }
};

export const createIssue = async (req, res) => {
  try {
    const { bugId } = req.params;
    const bug = await prisma.bug.findUnique({ where: { id: parseInt(bugId) } });

    if (!bug) return res.status(404).json({ message: "Bug not found." });
    if (bug.jiraIssueKey) return res.status(400).json({ message: "Bug is already linked to Jira issue: " + bug.jiraIssueKey });

    const config = await getJiraConfig(req.user.id);
    if (!config.url || !config.apiKey || !config.projectKey) {
      return res.status(400).json({ message: "Jira integration is missing URL, API Key, or Project Key metadata." });
    }

    let authString = config.apiKey;
    if (!authString.includes(":") && config.username) {
      authString = `${config.username}:${config.apiKey}`;
    }

    const payload = {
      fields: {
        project: {
          key: config.projectKey,
        },
        summary: bug.title,
        description: `Bug reported from QA Analytics Dashboard.\n\nSeverity: ${bug.severity}\nModule: ${bug.module}\n\n${bug.description || ""}`,
        issuetype: {
          name: "Bug",
        },
      },
    };

    const response = await axios.post(`${config.url}/rest/api/2/issue`, payload, {
      headers: {
        Authorization: `Basic ${Buffer.from(authString).toString("base64")}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const jiraKey = response.data.key;

    // Update local DB
    const updatedBug = await prisma.bug.update({
      where: { id: bug.id },
      data: { jiraIssueKey: jiraKey },
    });

    res.json({ message: "Jira issue created successfully.", bug: updatedBug });
  } catch (error) {
    console.error("Jira Create Issue Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to create issue in Jira", error: error.message });
  }
};

export const getIssueDetails = async (req, res) => {
  try {
    const { bugId } = req.params;
    const bug = await prisma.bug.findUnique({ where: { id: parseInt(bugId) } });

    if (!bug) return res.status(404).json({ message: "Bug not found." });
    if (!bug.jiraIssueKey) return res.status(400).json({ message: "Bug is not linked to Jira." });

    const config = await getJiraConfig(req.user.id);
    let authString = config.apiKey;
    if (!authString.includes(":") && config.username) {
      authString = `${config.username}:${config.apiKey}`;
    }

    const response = await axios.get(`${config.url}/rest/api/2/issue/${bug.jiraIssueKey}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(authString).toString("base64")}`,
        Accept: "application/json",
      },
    });

    const issue = response.data;
    const details = {
      key: issue.key,
      url: `${config.url}/browse/${issue.key}`,
      status: issue.fields.status?.name,
      assignee: issue.fields.assignee?.displayName || "Unassigned",
      priority: issue.fields.priority?.name,
      labels: issue.fields.labels || [],
    };

    res.json(details);
  } catch (error) {
    console.error("Jira Get Issue Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch issue from Jira", error: error.message });
  }
};
