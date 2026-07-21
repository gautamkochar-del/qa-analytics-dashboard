import * as testResultService from "./testResult.service.js";

export const getTestCases = async (req, res) => {
  try {
    const { testRunId } = req.params;
    if (!testRunId) {
      return res.status(400).json({ message: "testRunId is required" });
    }
    const testCases = await testResultService.getTestCasesForRun(testRunId);
    res.json(testCases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTestCase = async (req, res) => {
  try {
    const { id } = req.params;
    const testCase = await testResultService.getTestCaseById(id);
    if (!testCase) {
      return res.status(404).json({ message: "TestCaseResult not found" });
    }
    res.json(testCase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTestCase = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTestCase = await testResultService.updateTestCase(id, req.body);
    res.json(updatedTestCase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
