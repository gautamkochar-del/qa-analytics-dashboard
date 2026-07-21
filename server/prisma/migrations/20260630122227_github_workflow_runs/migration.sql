-- CreateTable
CREATE TABLE "GitHubWorkflowRun" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "githubRunId" TEXT NOT NULL,
    "workflowName" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "commitSha" TEXT NOT NULL,
    "commitMessage" TEXT,
    "actor" TEXT,
    "status" TEXT NOT NULL,
    "conclusion" TEXT,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "duration" INTEGER,
    "htmlUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GitHubWorkflowRun_githubRunId_key" ON "GitHubWorkflowRun"("githubRunId");
