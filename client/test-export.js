import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

try {
  const doc = new jsPDF();
  const summary = { totalProjects: 1, totalTestRuns: 1, passed: 1, failed: 0, openBugs: 0 };
  const projects = [{ project: "P1", totalTests: 1, passed: 1, failed: 0, passRate: 100, openBugs: 0 }];

  doc.text(`Projects: ${summary.totalProjects ?? 0}`, 14, 30);
  
  autoTable(doc, {
    startY: 90,
    head: [["Project", "Tests", "Passed", "Failed", "Pass %", "Open Bugs"]],
    body: projects.map(project => [
      project.project,
      project.totalTests,
      project.passed,
      project.failed,
      `${project.passRate}%`,
      project.openBugs,
    ]),
  });
  console.log("Success! autoTable worked.");
} catch(e) {
  console.error("Error:", e);
}
