import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// 1. Export JSON elements to CSV file
export const exportToCSV = (data, filename = "report.csv") => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(",")];

  data.forEach((row) => {
    const values = headers.map((header) => {
      const cell = row[header] === null || row[header] === undefined ? "" : row[header];
      const stringified = typeof cell === "object" ? JSON.stringify(cell) : String(cell);
      const escaped = stringified.replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  });

  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, filename);
};

// 2. Export array structure to Excel spreadsheets
export const exportToExcel = (data, sheetName = "Data Sheet", filename = "report.xlsx") => {
  if (!data || data.length === 0) return;

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, filename);
};

// 3. Export data rows to jsPDF document with customized styling
export const exportToPDF = (headers, data, title = "QA Dashboard Report", filename = "report.pdf") => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // Add customized header style
  doc.setFontSize(18);
  doc.setTextColor(37, 99, 235); // Blue primary matching Theme Mode
  doc.text(title, 14, 15);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Gray slate
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 21);

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 24, 196, 24);

  // Table using jspdf-autotable
  doc.autoTable({
    startY: 28,
    head: [headers],
    body: data,
    theme: "striped",
    headStyles: {
      fillColor: [37, 99, 235], // Primary theme color
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
  });

  doc.save(filename);
};
