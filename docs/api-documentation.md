# API Documentation

The QA Analytics Dashboard backend provides a standard RESTful API protected by JSON Web Tokens (JWT) and Role-Based Access Control (RBAC).

## Base URL
`/api`

## Authentication

Most endpoints require a valid JWT passed in the `Authorization` header.
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints Summary

### 1. Authentication
* `POST /api/auth/login` - Authenticate a user and receive a JWT.
* `GET /api/auth/me` - Get the current logged-in user profile.

### 2. Projects
* `GET /api/projects` - Retrieve all configured projects.
* `POST /api/projects` - Create a new project (Requires Admin/QA Lead).
* `PUT /api/projects/:id` - Update a project.
* `DELETE /api/projects/:id` - Delete a project.

### 3. Test Runs
* `GET /api/test-runs` - Retrieve test runs with pagination, filtering (projectId, status, environment), and sorting.
* `POST /api/test-runs` - Create a manual test run record.
* `PUT /api/test-runs/:id` - Update an existing test run.
* `DELETE /api/test-runs/:id` - Delete a test run.

### 4. Bugs / Defects
* `GET /api/bugs` - Retrieve bugs with pagination, filtering (projectId, severity, status), and sorting.
* `POST /api/bugs` - Log a new defect. (Automatically triggers Jira sync if enabled).
* `PUT /api/bugs/:id` - Update a bug. (Triggers Jira assignee/status sync).
* `DELETE /api/bugs/:id` - Delete a bug.

### 5. Importers & CI/CD
Allows automated tools to push execution results to the dashboard.
* `POST /api/import/playwright` - Upload `playwright-report.json`. (Multipart File).
* `POST /api/import/cypress` - Upload `cypress-results.json` / Mochawesome. (Multipart File).
* `POST /api/import/junit` - Upload `junit.xml`. (Multipart File).
* `POST /api/webhooks/jenkins?apiKey=...` - Push Jenkins generic JSON results.
* `POST /api/webhooks/github?apiKey=...` - Push GitHub Actions results.

### 6. Scheduled Reporting
* `POST /api/reports/schedule` - Schedule a daily/weekly/monthly automated email report.
* `GET /api/reports/export/pdf` - Instantly trigger a PDF generation download.
* `GET /api/reports/export/excel` - Instantly trigger an Excel generation download.

### 7. Administration (RBAC)
* `GET /api/users` - List users.
* `POST /api/users` - Create a user.
* `PUT /api/users/:id/role` - Update a user's RBAC role.
* `PUT /api/users/:id/disable` - Disable an account.

---

## Response Format

Success responses generally return a standard JSON object or array. Error responses return a uniform format:
```json
{
  "message": "Human readable error description",
  "error": "Detailed error string (only in dev mode)"
}
```
