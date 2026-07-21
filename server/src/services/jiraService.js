import prisma from "../config/prisma.js";

// Helper to get Jira config
const getJiraConfig = async () => {
  const integration = await prisma.integration.findFirst({
    where: { provider: "Jira", isActive: true }
  });
  if (!integration) return null;
  
  let projectKey = "QA";
  if (integration.metadata) {
    try {
      const meta = JSON.parse(integration.metadata);
      if (meta.projectKey) projectKey = meta.projectKey;
    } catch (e) {}
  }

  return {
    url: integration.url,
    apiKey: integration.apiKey, // Expected format: email:api_token
    projectKey,
  };
};

export const syncCreateBug = async (bug) => {
  try {
    const config = await getJiraConfig();
    if (!config || !config.url) return;

    const authHeader = `Basic ${Buffer.from(config.apiKey).toString('base64')}`;
    
    const body = {
      fields: {
        project: { key: config.projectKey },
        summary: bug.title,
        description: bug.description || "No description provided.",
        issuetype: { name: "Bug" },
      }
    };

    const response = await fetch(`${config.url}/rest/api/2/issue`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      const data = await response.json();
      // Update our bug with the Jira Issue Key
      await prisma.bug.update({
        where: { id: bug.id },
        data: { jiraIssueKey: data.key }
      });
      console.log(`Successfully synced Bug ${bug.id} to Jira issue ${data.key}`);
    } else {
      const err = await response.text();
      console.error("Failed to create Jira issue:", err);
    }
  } catch (error) {
    console.error("Jira Sync Error (Create):", error);
  }
};

export const syncUpdateBug = async (bug) => {
  try {
    if (!bug.jiraIssueKey) return; 
    const config = await getJiraConfig();
    if (!config || !config.url) return;

    const authHeader = `Basic ${Buffer.from(config.apiKey).toString('base64')}`;
    
    // 1. Assign Issue
    if (bug.assignee && bug.assignee.email) {
      const userRes = await fetch(`${config.url}/rest/api/2/user/search?query=${bug.assignee.email}`, {
        headers: { 'Authorization': authHeader, 'Accept': 'application/json' }
      });
      if (userRes.ok) {
        const users = await userRes.json();
        if (users.length > 0) {
          const accountId = users[0].accountId;
          await fetch(`${config.url}/rest/api/2/issue/${bug.jiraIssueKey}/assignee`, {
            method: 'PUT',
            headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountId })
          });
          console.log(`Successfully assigned Jira issue ${bug.jiraIssueKey} to ${accountId}`);
        }
      }
    }

    // 2. Update Status
    let jiraStatus = "";
    if (bug.status === "Open") jiraStatus = "To Do";
    else if (bug.status === "In Progress") jiraStatus = "In Progress";
    else if (bug.status === "Closed") jiraStatus = "Done";

    if (jiraStatus) {
      const transRes = await fetch(`${config.url}/rest/api/2/issue/${bug.jiraIssueKey}/transitions`, {
        headers: { 'Authorization': authHeader, 'Accept': 'application/json' }
      });
      if (transRes.ok) {
        const transData = await transRes.json();
        const transition = transData.transitions?.find(t => t.to.name.toLowerCase() === jiraStatus.toLowerCase());
        if (transition) {
          await fetch(`${config.url}/rest/api/2/issue/${bug.jiraIssueKey}/transitions`, {
            method: 'POST',
            headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' },
            body: JSON.stringify({ transition: { id: transition.id } })
          });
          console.log(`Successfully updated Jira issue ${bug.jiraIssueKey} status to ${jiraStatus}`);
        }
      }
    }
  } catch (error) {
    console.error("Jira Sync Error (Update):", error);
  }
};

export const syncAllBugsFromJira = async () => {
  try {
    const config = await getJiraConfig();
    if (!config || !config.url) return 0;
    
    let authString = config.apiKey;
    if (!authString.includes(":") && config.username) {
      authString = `${config.username}:${config.apiKey}`;
    }

    const jql = config.projectKey ? `project=${config.projectKey} AND issuetype=Bug` : `issuetype=Bug`;
    const response = await fetch(`${config.url}/rest/api/2/search?jql=${encodeURIComponent(jql)}&maxResults=50&fields=summary,description,status,priority,assignee`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(authString).toString('base64')}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error("Failed to fetch Jira issues for cron sync.");
      return 0;
    }

    const data = await response.json();
    const issues = data.issues || [];
    
    const defaultProject = await prisma.project.findFirst();
    if (!defaultProject) return 0;

    let syncedCount = 0;
    for (const issue of issues) {
      const jiraKey = issue.key;
      const title = issue.fields.summary;
      const desc = issue.fields.description || "";
      const statusName = issue.fields.status?.name || "Open";
      
      let localStatus = "Open";
      if (statusName.toLowerCase().includes("progress")) localStatus = "In Progress";
      if (statusName.toLowerCase().includes("done") || statusName.toLowerCase().includes("resolv")) localStatus = "Resolved";
      if (statusName.toLowerCase().includes("clos")) localStatus = "Closed";

      const priorityName = issue.fields.priority?.name || "Medium";
      let localSeverity = "Medium";
      if (priorityName.toLowerCase().includes("high") || priorityName.toLowerCase().includes("crit")) localSeverity = "High";
      if (priorityName.toLowerCase().includes("low") || priorityName.toLowerCase().includes("minor")) localSeverity = "Low";

      const existingBug = await prisma.bug.findFirst({
        where: { jiraIssueKey: jiraKey },
      });

      if (existingBug) {
        await prisma.bug.update({
          where: { id: existingBug.id },
          data: { title, description: desc, status: localStatus, severity: localSeverity },
        });
      } else {
        await prisma.bug.create({
          data: {
            title, description: desc, status: localStatus, severity: localSeverity,
            projectId: defaultProject.id, jiraIssueKey: jiraKey, module: "Synced from Jira",
          },
        });
      }
      syncedCount++;
    }
    console.log(`Cron: Synced ${syncedCount} bugs from Jira.`);
    return syncedCount;
  } catch (err) {
    console.error("Cron Jira Sync Error:", err);
    return 0;
  }
};
