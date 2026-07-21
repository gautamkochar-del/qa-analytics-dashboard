import cron from "node-cron";
import prisma from "../config/prisma.js";
import { sendReportEmail } from "./emailService.js";
import { getDashboardSummary } from "./dashboardService.js";
import { syncAllBugsFromJira } from "./jiraService.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

export const initCronJobs = () => {
  // Run every day at 08:00 AM
  cron.schedule("0 8 * * *", async () => {
    console.log("Running scheduled reports job (Daily)");
    await processSchedules("daily");
  });

  // Run every Monday at 08:00 AM
  cron.schedule("0 8 * * 1", async () => {
    console.log("Running scheduled reports job (Weekly)");
    await processSchedules("weekly");
  });

  // Run on the 1st of every month at 08:00 AM
  cron.schedule("0 8 1 * *", async () => {
    console.log("Running scheduled reports job (Monthly)");
    await processSchedules("monthly");
  });

  // Sync Jira bugs every hour
  cron.schedule("0 * * * *", async () => {
    console.log("Running automated Jira Sync");
    await syncAllBugsFromJira();
  });
};

const processSchedules = async (frequency) => {
  try {
    const schedules = await prisma.reportSchedule.findMany({
      where: {
        isActive: true,
        frequency,
      },
    });

    if (schedules.length === 0) return;

    // Generate report data once for all schedules of this frequency
    const summary = await getDashboardSummary();
    const htmlBody = generateHtmlReport(summary, frequency);
    
    // Generate attachments
    const pdfBuffer = await generatePdfBuffer(summary, frequency);
    const excelBuffer = await generateExcelBuffer(summary, frequency);

    const attachments = [
      {
        filename: `QA_Report_${frequency}.pdf`,
        content: pdfBuffer,
      },
      {
        filename: `QA_Report_${frequency}.xlsx`,
        content: excelBuffer,
      }
    ];

    for (const schedule of schedules) {
      try {
        let recipients = [];
        try {
          recipients = JSON.parse(schedule.recipients);
        } catch (e) {
          recipients = [schedule.recipients];
        }

        const emailResult = await sendReportEmail(
          recipients.join(", "),
          `QA Analytics ${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Report`,
          htmlBody,
          attachments
        );

        await prisma.reportHistory.create({
          data: {
            scheduleId: schedule.id,
            status: emailResult.success ? "success" : "failed",
            summary: emailResult.success
              ? `Sent to ${recipients.length} recipients`
              : emailResult.error,
          },
        });
      } catch (scheduleError) {
        console.error(`Failed to process schedule ${schedule.id}:`, scheduleError);
      }
    }
  } catch (error) {
    console.error(`Failed to process ${frequency} schedules:`, error);
  }
};

const generateHtmlReport = (summary, frequency) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #1a56db;">QA Analytics ${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Report</h2>
      <p>Here is the automated summary of your QA Dashboard.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr style="background-color: #f3f4f6;">
          <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Metric</th>
          <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Value</th>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">Total Projects</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">${summary.projects}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">Total Test Runs</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">${summary.testRuns}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">Tests Passed</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #10b981;">${summary.passed}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">Tests Failed</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #ef4444;">${summary.failed}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">Open Bugs</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #f59e0b;">${summary.openBugs}</td>
        </tr>
      </table>
      
      <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">
        This is an automated message from your QA Analytics Dashboard.
      </p>
    </div>
  `;
};

const generatePdfBuffer = (summary, frequency) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    doc.fontSize(20).text(`QA Analytics ${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Report`, { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(14).text(`Total Projects: ${summary.projects}`);
    doc.text(`Total Test Runs: ${summary.testRuns}`);
    doc.text(`Tests Passed: ${summary.passed}`);
    doc.text(`Tests Failed: ${summary.failed}`);
    doc.text(`Open Bugs: ${summary.openBugs}`);
    
    doc.end();
  });
};

const generateExcelBuffer = async (summary, frequency) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(`${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Report`);
  
  sheet.columns = [
    { header: 'Metric', key: 'metric', width: 20 },
    { header: 'Value', key: 'value', width: 15 }
  ];
  
  sheet.addRow({ metric: 'Total Projects', value: summary.projects });
  sheet.addRow({ metric: 'Total Test Runs', value: summary.testRuns });
  sheet.addRow({ metric: 'Tests Passed', value: summary.passed });
  sheet.addRow({ metric: 'Tests Failed', value: summary.failed });
  sheet.addRow({ metric: 'Open Bugs', value: summary.openBugs });
  
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};
