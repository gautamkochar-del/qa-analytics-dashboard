import prisma from "../config/prisma.js";
import xml2js from "xml2js";

/**
 * Handle generic JSON test results import
 * Expects format similar to Mochawesome or a custom generic JSON format
 */
export const importTestResults = async (req, res) => {
  try {
    const { projectId, environment, suiteName, results } = req.body;

    if (!projectId || !results) {
      return res.status(400).json({ message: "projectId and results are required" });
    }

    // Basic calculation
    let passed = 0;
    let failed = 0;
    let skipped = 0;
    let totalDuration = 0;

    // This assumes results is an array of test cases
    const testCases = Array.isArray(results) ? results : results.tests || [];

    testCases.forEach((test) => {
      if (test.state === "passed") passed++;
      else if (test.state === "failed") failed++;
      else skipped++;

      totalDuration += (test.duration || 0); // duration in ms
    });

    const total = passed + failed + skipped;
    const durationSecs = Math.round(totalDuration / 1000);
    const status = failed > 0 ? "failed" : "passed";

    // 1. Create the TestRun
    const testRun = await prisma.testRun.create({
      data: {
        projectId: Number(projectId),
        environment: environment || "QA",
        suiteName: suiteName || "Automated Import Suite",
        status,
        total,
        passed,
        failed,
        skipped,
        duration: durationSecs,
      },
    });

    // 2. Automatically log bugs for failed tests (optional, but requested feature: Jira linking later)
    const newBugs = [];
    for (const test of testCases) {
      if (test.state === "failed") {
        const bug = await prisma.bug.create({
          data: {
            title: `Automated Test Failure: ${test.title || "Unknown Test"}`,
            description: `Error: ${test.error || "No error message provided"}\n\nStack Trace:\n${test.stackTrace || ""}`,
            severity: "High",
            status: "Open",
            projectId: Number(projectId),
            module: suiteName || "Automated Suite",
          },
        });
        newBugs.push(bug);
      }
    }

    // Trigger web socket updates for real-time dashboard refresh
    req.app.get("io").emit("dashboardUpdate", { type: "testRun", action: "create" });
    if (newBugs.length > 0) {
      req.app.get("io").emit("dashboardUpdate", { type: "bug", action: "create" });
    }

    res.status(201).json({
      message: "Test results imported successfully",
      testRunId: testRun.id,
      bugsCreated: newBugs.length,
    });
  } catch (error) {
    console.error("Import error:", error);
    res.status(500).json({ message: "Failed to import test results", error: error.message });
  }
};

// Internal helper to create the test run and emit events
const createImportedTestRun = async (req, res, { projectId, environment, suiteName, passed, failed, skipped, duration }) => {
  const total = passed + failed + skipped;
  const status = failed > 0 ? "failed" : "passed";

  const testRun = await prisma.testRun.create({
    data: {
      projectId: Number(projectId),
      environment: environment || "CI/CD",
      suiteName,
      status,
      total,
      passed,
      failed,
      skipped,
      duration,
    },
  });

  req.app.get("io").emit("dashboardUpdate", { type: "testRun", action: "create" });
  return testRun;
};

export const importPlaywright = async (req, res) => {
  try {
    const { projectId, environment, suiteName = "Playwright Suite" } = req.body;
    if (!projectId || !req.file) {
      return res.status(400).json({ message: "projectId and file are required" });
    }

    const payload = JSON.parse(req.file.buffer.toString('utf-8'));
    
    let passed = 0;
    let failed = 0;
    let skipped = 0;
    let durationMs = 0;

    const parsedTestCases = [];

    const parseSuite = (suite) => {
      if (suite.specs) {
        suite.specs.forEach(spec => {
          spec.tests.forEach(test => {
            test.results.forEach(res => {
              let status = "passed";
              let errorMsg = null;
              
              if (res.status === "passed" || res.status === "expected") {
                passed++;
                status = "passed";
              } else if (res.status === "failed" || res.status === "timedOut" || res.status === "unexpected") {
                failed++;
                status = "failed";
                errorMsg = res.error?.message || res.error?.value || "Test Failed";
              } else {
                skipped++;
                status = "skipped";
              }
              durationMs += res.duration || 0;

              parsedTestCases.push({
                name: spec.title || "Unnamed Playwright Test",
                className: spec.file || null,
                status: status,
                duration: parseFloat(((res.duration || 0) / 1000).toFixed(2)),
                error: errorMsg,
              });
            });
          });
        });
      }
      if (suite.suites) {
        suite.suites.forEach(parseSuite);
      }
    };
    
    if (payload.suites) {
      payload.suites.forEach(parseSuite);
    } else if (payload.stats) {
      // Some custom playwright reporters output stats directly
      passed = payload.stats.expected || 0;
      failed = payload.stats.unexpected || 0;
      skipped = payload.stats.flaky || 0;
      durationMs = payload.stats.duration || 0;
    }

    const testRun = await createImportedTestRun(req, res, {
      projectId, environment, suiteName, passed, failed, skipped, duration: Math.round(durationMs / 1000)
    });

    if (parsedTestCases.length > 0) {
      const testCasesToInsert = parsedTestCases.map(tc => ({
        ...tc,
        testRunId: testRun.id
      }));
      await prisma.testCaseResult.createMany({
        data: testCasesToInsert
      });
    }

    res.status(201).json({ message: "Playwright results imported successfully", testRunId: testRun.id });
  } catch (error) {
    console.error("Playwright import error:", error);
    res.status(500).json({ message: "Failed to parse Playwright report", error: error.message });
  }
};

export const importCypress = async (req, res) => {
  try {
    const { projectId, environment, suiteName = "Cypress Suite" } = req.body;
    if (!projectId || !req.file) {
      return res.status(400).json({ message: "projectId and file are required" });
    }

    const payload = JSON.parse(req.file.buffer.toString('utf-8'));
    
    let passed = 0;
    let failed = 0;
    let skipped = 0;
    let durationMs = 0;

    const parsedTestCases = [];

    if (payload.stats) {
      passed = payload.stats.passes || 0;
      failed = payload.stats.failures || 0;
      skipped = (payload.stats.pending || 0) + (payload.stats.skipped || 0);
      durationMs = payload.stats.duration || 0;
    }

    if (payload.results) {
      payload.results.forEach(run => {
        if (run.suites) {
          run.suites.forEach(suite => {
            if (suite.tests) {
              suite.tests.forEach(test => {
                let status = "passed";
                let errorMsg = null;
                
                if (test.state === "failed") {
                  status = "failed";
                  errorMsg = test.err?.message || test.err?.estack || "Test Failed";
                } else if (test.state === "pending" || test.state === "skipped") {
                  status = "skipped";
                }

                parsedTestCases.push({
                  name: test.title || "Unnamed Cypress Test",
                  className: suite.title || run.file || null,
                  status: status,
                  duration: parseFloat(((test.duration || 0) / 1000).toFixed(2)),
                  error: errorMsg,
                });
              });
            }
          });
        }
      });
    }

    const testRun = await createImportedTestRun(req, res, {
      projectId, environment, suiteName, passed, failed, skipped, duration: Math.round(durationMs / 1000)
    });

    if (parsedTestCases.length > 0) {
      const testCasesToInsert = parsedTestCases.map(tc => ({
        ...tc,
        testRunId: testRun.id
      }));
      await prisma.testCaseResult.createMany({
        data: testCasesToInsert
      });
    }

    res.status(201).json({ message: "Cypress results imported successfully", testRunId: testRun.id });
  } catch (error) {
    console.error("Cypress import error:", error);
    res.status(500).json({ message: "Failed to parse Cypress report", error: error.message });
  }
};

export const importJUnit = async (req, res) => {
  try {
    const { projectId, environment, suiteName = "JUnit Suite" } = req.body;
    if (!projectId || !req.file) {
      return res.status(400).json({ message: "projectId and file are required" });
    }

    const xmlData = req.file.buffer.toString('utf-8');
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xmlData);

    let passed = 0;
    let failed = 0;
    let skipped = 0;
    let durationSec = 0;

    // Handle standard <testsuites> format
    const testsuites = result.testsuites;
    if (testsuites && testsuites.$) {
      const stats = testsuites.$;
      const tests = parseInt(stats.tests || "0", 10);
      failed = parseInt(stats.failures || "0", 10) + parseInt(stats.errors || "0", 10);
      skipped = parseInt(stats.skipped || "0", 10) + parseInt(stats.disabled || "0", 10);
      passed = tests - failed - skipped;
      durationSec = parseFloat(stats.time || "0");
    } else if (result.testsuite && result.testsuite.$) {
      // Handle <testsuite> root element
      const stats = result.testsuite.$;
      const tests = parseInt(stats.tests || "0", 10);
      failed = parseInt(stats.failures || "0", 10) + parseInt(stats.errors || "0", 10);
      skipped = parseInt(stats.skipped || "0", 10);
      passed = tests - failed - skipped;
      durationSec = parseFloat(stats.time || "0");
    } else {
       // fallback manual counting if neither root attributes exist
       return res.status(400).json({ message: "Could not find root <testsuites> or <testsuite> with metrics in JUnit XML" });
    }

    // Array to hold the individual test case results
    const parsedTestCases = [];

    // Helper to process a <testsuite> node
    const processTestSuite = (suite) => {
      if (suite.testcase) {
        suite.testcase.forEach(tc => {
          let status = "passed";
          let errorMsg = null;

          if (tc.failure) {
            status = "failed";
            errorMsg = typeof tc.failure[0] === 'string' ? tc.failure[0] : (tc.failure[0]._ || tc.failure[0].$.message);
          } else if (tc.error) {
            status = "failed";
            errorMsg = typeof tc.error[0] === 'string' ? tc.error[0] : (tc.error[0]._ || tc.error[0].$.message);
          } else if (tc.skipped) {
            status = "skipped";
          }

          parsedTestCases.push({
            name: tc.$.name || "Unnamed Test",
            className: tc.$.classname || null,
            status: status,
            duration: parseFloat(tc.$.time || "0"),
            error: errorMsg,
          });
        });
      }
      // Recursively process nested testsuites if they exist
      if (suite.testsuite) {
        suite.testsuite.forEach(processTestSuite);
      }
    };

    // Extract test cases
    if (result.testsuites && result.testsuites.testsuite) {
      result.testsuites.testsuite.forEach(processTestSuite);
    } else if (result.testsuite) {
      // If root is <testsuite> instead of <testsuites>
      // Wrap it in an array so processTestSuite can handle it
      [result.testsuite].forEach(processTestSuite);
    }

    const testRun = await createImportedTestRun(req, res, {
      projectId, environment, suiteName, passed, failed, skipped, duration: Math.round(durationSec)
    });

    if (parsedTestCases.length > 0) {
      const testCasesToInsert = parsedTestCases.map(tc => ({
        ...tc,
        testRunId: testRun.id
      }));
      await prisma.testCaseResult.createMany({
        data: testCasesToInsert
      });
    }

    res.status(201).json({ message: "JUnit results imported successfully", testRunId: testRun.id, testCasesParsed: parsedTestCases.length });
  } catch (error) {
    console.error("JUnit import error:", error);
    res.status(500).json({ message: "Failed to parse JUnit XML", error: error.message });
  }
};
