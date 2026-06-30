export async function getDashboardMetrics() {
  return Promise.resolve({
    totalTests: 1520, passed: 1462, failed: 58, openBugs: 17, });
}
