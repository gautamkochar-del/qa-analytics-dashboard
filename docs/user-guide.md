# User Guide

Welcome to the QA Analytics Dashboard! This guide will walk you through the primary features and how to leverage them to improve your team's quality assurance visibility.

## 1. Dashboard Overview
Upon logging in, you are greeted with the live Dashboard. 
- The KPI cards at the top show high-level summaries (Total Tests, Pass Rates, Active Bugs).
- Because the dashboard leverages WebSockets, you **do not need to refresh the page**. If a CI/CD pipeline finishes a test run or a teammate logs a new defect, the charts and metrics will update instantly.

## 2. Managing Projects
Before logging runs or bugs, ensure your Projects are configured.
- Navigate to **Projects** on the sidebar.
- Click **New Project** to add the application or service you are testing.
- When a project is created, an automated email notification is sent to the admin team.

## 3. Test Suite Runs
Navigate to **Test Suite Runs** to view execution histories.
- **Manual Logging**: Click **New Test Run** to manually input execution metrics.
- **Automated Import**: Click **Import Report** to upload artifacts directly from your test runners (Playwright `json`, Cypress `json`, or JUnit `xml`). The dashboard parses the metrics instantly.
- **CI/CD Integration**: Webhook URLs can be found in the **Integrations** panel to allow Jenkins or GitHub Actions to push results to this page automatically.

## 4. Defect & Bug Tracking
Navigate to **Defects & Bugs** to log issues.
- **Jira Sync**: If your workspace admin has configured a Jira Integration (under the Integrations tab), creating a Bug in this dashboard will automatically create a mirrored ticket in Jira! 
- The Jira Ticket ID (e.g., QA-123) will appear as a clickable blue link in the table. Updating the bug's status or assignee in the dashboard will instantly synchronize the change to Jira.

## 5. Reports & Analytics
- **Manual Export**: Navigate to **Reports & Analytics**. You can use the export dropdown to instantly generate a formatted PDF or Excel file of your test runs and bugs.
- **Scheduled Reports**: Click **Schedule New Report** to configure automated distributions. You can select the frequency (Daily, Weekly, Monthly) and input an array of email recipients. The backend Cron system will automatically build the PDF/Excel and email it out.

## 6. Administration (Admin Panel)
*Only accessible to users with the Admin role.*
- Navigate to **Admin Panel** to manage your team.
- You can create Departments, Teams, and new Users.
- Use the **Role** assignment to restrict what users can do (e.g., making a user a 'Viewer' prevents them from editing or deleting data).
- The **Audit Logs** tab (in the sidebar) tracks every mutating action (Create/Update/Delete) performed by any user, ensuring full traceability and security compliance.
