-- CreateTable
CREATE TABLE "TestCaseResult" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "testRunId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "className" TEXT,
    "status" TEXT NOT NULL,
    "duration" REAL NOT NULL,
    "error" TEXT,
    "stackTrace" TEXT,
    "screenshot" TEXT,
    "video" TEXT,
    "logFile" TEXT,
    "retries" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TestCaseResult_testRunId_fkey" FOREIGN KEY ("testRunId") REFERENCES "TestRun" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "TestCaseResult_testRunId_idx" ON "TestCaseResult"("testRunId");
