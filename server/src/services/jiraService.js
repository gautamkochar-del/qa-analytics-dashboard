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
