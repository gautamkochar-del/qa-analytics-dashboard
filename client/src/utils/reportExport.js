import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/* ---------------- PDF ---------------- */

export const exportPDF = (summary, projects) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("QA Analytics Report", 14, 20);

  doc.setFontSize(12);

  doc.text(`Projects: ${summary.projects}`, 14, 35);
  doc.text(`Active Projects: ${summary.activeProjects}`, 14, 43);
  doc.text(`Test Runs: ${summary.testRuns}`, 14, 51);
  doc.text(`Passed Tests: ${summary.passed}`, 14, 59);
  doc.text(`Failed Tests: ${summary.failed}`, 14, 67);
  doc.text(`Open Bugs: ${summary.openBugs}`, 14, 75);

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
    body: projects.map((p) => [
	  p.name,
	  p.total,
	  p.passed,
	  p.failed,
	  `${p.passRate}%`,
	  p.openBugs,
	]),
  });

  doc.save("QA_Report.pdf");
};

/* ---------------- Excel ---------------- */

export const exportExcel = (projects) => {
  const data = projects.map((p) => ({
    Project: p.name,
    "Total Tests": p.total,
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
    Project: p.name,
    "Total Tests": p.total,
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
