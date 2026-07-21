import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/* ---------------- PDF ---------------- */

export const exportPDF = (summary, projects) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("QA Analytics Report", 14, 20);

  doc.setFontSize(12);

  doc.text(`Projects: ${summary?.totalProjects ?? 0}`, 14, 30);
  doc.text(`Test Runs: ${summary?.totalTestRuns ?? 0}`, 14, 40);
  doc.text(`Passed Tests: ${summary?.passed ?? 0}`, 14, 50);
  doc.text(`Failed Tests: ${summary?.failed ?? 0}`, 14, 60);
  doc.text(`Open Bugs: ${summary?.openBugs ?? 0}`, 14, 70);

  autoTable(doc, {
    startY: 90,
    head: [[
      "Project",
      "Tests",
      "Passed",
      "Failed",
      "Pass %",
      "Open Bugs",
    ]],
    body: projects.map(project => [
    project.project,
    project.totalTests,
    project.passed,
    project.failed,
    `${project.passRate}%`,
    project.openBugs,
]),
  });

  doc.save("QA_Report.pdf");
};

/* ---------------- Excel ---------------- */

export const exportExcel = (projects) => {
  const data = projects.map((p) => ({
    Project: p.project,
    "Total Tests": p.totalTests,
    Passed: p.passed,
    Failed: p.failed,
    "Pass %": p.passRate,
    "Open Bugs": p.openBugs,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Project Summary"
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(
    new Blob([excelBuffer]),
    "QA_Report.xlsx"
  );
};

/* ---------------- CSV ---------------- */

export const exportCSV = (projects) => {
  const data = projects.map((p) => ({
    Project: p.project,
    "Total Tests": p.totalTests,
    Passed: p.passed,
    Failed: p.failed,
    "Pass %": p.passRate,
    "Open Bugs": p.openBugs,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const csv = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  saveAs(blob, "QA_Report.csv");
};
