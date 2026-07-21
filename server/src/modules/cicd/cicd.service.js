import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

const getJenkinsConfig = async (userId) => {
  const integration = await prisma.integration.findFirst({
    where: { userId, provider: "Jenkins", isActive: true },
  });

  if (!integration || !integration.url || !integration.apiKey) {
    throw new Error("Jenkins is not connected.");
  }

  let metadata = {};
  try {
    metadata = JSON.parse(integration.metadata || "{}");
  } catch (err) {}

  return {
    url: integration.url.replace(/\/$/, ""),
    username: metadata.username,
    token: integration.apiKey,
  };
};

export const connectJenkins = async (userId, url, username, token) => {
  try {
    const cleanUrl = url.replace(/\/$/, "");
    const response = await axios.get(`${cleanUrl}/api/json`, {
      auth: { username, password: token }
    });

    if (response.status !== 200) throw new Error("Invalid response from Jenkins.");

    let integration = await prisma.integration.findFirst({
      where: { userId, provider: "Jenkins" },
    });

    if (integration) {
      integration = await prisma.integration.update({
        where: { id: integration.id },
        data: {
          url: cleanUrl,
          apiKey: token,
          isActive: true,
          metadata: JSON.stringify({ username }),
        },
      });
    } else {
      integration = await prisma.integration.create({
        data: {
          userId,
          provider: "Jenkins",
          name: "Jenkins CI",
          url: cleanUrl,
          apiKey: token,
          isActive: true,
          metadata: JSON.stringify({ username }),
        },
      });
    }

    return { message: "Jenkins connected successfully." };
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("Invalid Jenkins credentials.");
    }
    throw new Error("Failed to connect to Jenkins: " + error.message);
  }
};

export const disconnectJenkins = async (userId) => {
  const integration = await prisma.integration.findFirst({
    where: { userId, provider: "Jenkins" },
  });

  if (!integration) throw new Error("Jenkins is not connected.");

  await prisma.integration.update({
    where: { id: integration.id },
    data: { isActive: false, apiKey: "" },
  });

  return { message: "Jenkins disconnected successfully." };
};

export const getJenkinsStatus = async (userId) => {
  const integration = await prisma.integration.findFirst({
    where: { userId, provider: "Jenkins" },
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
    url: integration.url,
    username: metadata.username,
  };
};

export const getJenkinsJobs = async (userId) => {
  const { url, username, token } = await getJenkinsConfig(userId);

  try {
    const response = await axios.get(`${url}/api/json?tree=jobs[name,url,color]`, {
      auth: { username, password: token }
    });
    
    return response.data.jobs.map(job => ({
      name: job.name,
      url: job.url,
      status: job.color === "blue" ? "success" : job.color === "red" ? "failed" : job.color === "notbuilt" ? "not_built" : "other"
    }));
  } catch (error) {
    throw new Error("Failed to fetch Jenkins jobs.");
  }
};

export const getJenkinsBuilds = async (userId, jobName) => {
  const { url, username, token } = await getJenkinsConfig(userId);

  try {
    const response = await axios.get(`${url}/job/${jobName}/api/json?tree=builds[id,number,result,duration,timestamp,url,building]`, {
      auth: { username, password: token }
    });

    return response.data.builds.map(build => ({
      id: build.id,
      number: build.number,
      status: build.building ? "IN_PROGRESS" : build.result,
      duration: build.duration,
      timestamp: build.timestamp,
      url: build.url,
    }));
  } catch (error) {
    throw new Error("Failed to fetch builds for job " + jobName);
  }
};

export const getJenkinsBuildLog = async (userId, jobName, buildNumber) => {
  const { url, username, token } = await getJenkinsConfig(userId);

  try {
    const response = await axios.get(`${url}/job/${jobName}/${buildNumber}/consoleText`, {
      auth: { username, password: token },
      responseType: 'text'
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch console log.");
  }
};

export const triggerJenkinsJob = async (userId, jobName, parameters = {}) => {
  const { url, username, token } = await getJenkinsConfig(userId);

  try {
    // If parameters exist, use buildWithParameters, else build
    const hasParams = Object.keys(parameters).length > 0;
    const endpoint = hasParams ? "buildWithParameters" : "build";
    const query = hasParams ? `?${new URLSearchParams(parameters).toString()}` : "";

    const response = await axios.post(`${url}/job/${jobName}/${endpoint}${query}`, null, {
      auth: { username, password: token }
    });

    // Jenkins responds with 201 Created on successful trigger
    if (response.status === 201) {
      return { message: `Job ${jobName} triggered successfully.` };
    }
    throw new Error("Failed to trigger job.");
  } catch (error) {
    throw new Error("Error triggering job: " + error.message);
  }
};

export const getJenkinsFailedStage = async (userId, jobName, buildNumber) => {
  const { url, username, token } = await getJenkinsConfig(userId);

  try {
    // Jenkins Workflow API plugin is needed for this endpoint
    const response = await axios.get(`${url}/job/${jobName}/${buildNumber}/wfapi/describe`, {
      auth: { username, password: token }
    });
    
    const stages = response.data.stages || [];
    const failedStage = stages.find(s => s.status === "FAILED");
    
    return failedStage ? {
      name: failedStage.name,
      status: failedStage.status,
      durationMillis: failedStage.durationMillis,
      error: failedStage.error
    } : null;
  } catch (error) {
    // If wfapi doesn't exist, we just return null gracefully
    return null; 
  }
};

// Optional: specific linking endpoint to map a build to a test run
export const linkBuildToTestRun = async (testRunId, buildUrl) => {
  try {
    const testRun = await prisma.testRun.update({
      where: { id: parseInt(testRunId) },
      data: { jenkinsBuildUrl: buildUrl }
    });
    return testRun;
  } catch (error) {
    throw new Error("Failed to link build to test run.");
  }
};
