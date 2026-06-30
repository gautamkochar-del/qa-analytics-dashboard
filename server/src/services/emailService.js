import nodemailer from "nodemailer";

// By default, we use ethereal for testing if no SMTP is provided
export const sendReportEmail = async (to, subject, htmlBody, attachments = []) => {
  try {
    let transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Fallback to ethereal for testing
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(`Using Ethereal testing account: ${testAccount.user}`);
    }

    const info = await transporter.sendMail({
      from: '"QA Dashboard" <no-reply@qadashboard.local>',
      to,
      subject,
      html: htmlBody,
      attachments,
    });

    console.log("Message sent: %s", info.messageId);
    if (!process.env.SMTP_HOST) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: error.message };
  }
};

// Example Notification: Project Created
export const sendProjectCreatedEmail = async (project, adminEmail = "admin@example.com") => {
  const subject = `New Project Created: ${project.name}`;
  const htmlBody = `
    <h2>Project Created</h2>
    <p>A new project <strong>${project.name}</strong> has been created successfully.</p>
    <p>Description: ${project.description || "N/A"}</p>
    <p>Status: ${project.status}</p>
  `;
  return sendReportEmail(adminEmail, subject, htmlBody);
};

// Example Notification: Bug Assigned
export const sendBugAssignedEmail = async (bug, assigneeEmail) => {
  const subject = `Bug Assigned to You: ${bug.title}`;
  const htmlBody = `
    <h2>Bug Assigned</h2>
    <p>You have been assigned to the following bug:</p>
    <ul>
      <li><strong>Title:</strong> ${bug.title}</li>
      <li><strong>Severity:</strong> ${bug.severity}</li>
      <li><strong>Status:</strong> ${bug.status}</li>
      <li><strong>Module:</strong> ${bug.module}</li>
    </ul>
    <p>Please log in to the dashboard to review the details.</p>
  `;
  return sendReportEmail(assigneeEmail, subject, htmlBody);
};

// Example Notification: Execution Completed
export const sendExecutionCompletedEmail = async (testRun, recipients = "team@example.com") => {
  const subject = `Test Execution Completed: ${testRun.suiteName}`;
  const htmlBody = `
    <h2>Execution Completed</h2>
    <p>A test run for <strong>${testRun.suiteName}</strong> has finished executing.</p>
    <ul>
      <li><strong>Environment:</strong> ${testRun.environment}</li>
      <li><strong>Status:</strong> ${testRun.status}</li>
      <li><strong>Total Tests:</strong> ${testRun.total}</li>
      <li><strong>Passed:</strong> ${testRun.passed}</li>
      <li><strong>Failed:</strong> ${testRun.failed}</li>
    </ul>
  `;
  return sendReportEmail(recipients, subject, htmlBody);
};

// Example Notification: Critical Bug Found
export const sendCriticalBugFoundEmail = async (bug, recipients = "alerts@example.com") => {
  const subject = `CRITICAL BUG REPORTED: ${bug.title}`;
  const htmlBody = `
    <h2 style="color: red;">Critical Bug Found</h2>
    <p>A new critical bug has been logged and requires immediate attention.</p>
    <ul>
      <li><strong>Title:</strong> ${bug.title}</li>
      <li><strong>Project ID:</strong> ${bug.projectId}</li>
      <li><strong>Module:</strong> ${bug.module}</li>
    </ul>
    <p>Please check the issue immediately.</p>
  `;
  return sendReportEmail(recipients, subject, htmlBody);
};
