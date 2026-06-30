# QA Analytics Dashboard

The QA Analytics Dashboard is a modern, full-stack, enterprise-grade application for managing and analyzing Quality Assurance testing data. It enables seamless tracking of test suite runs, defects, and pipeline metrics from multiple CI/CD platforms, presenting live updates in an interactive, responsive user interface.

## Table of Contents

- [Overview](#overview)
- [Documentation](#documentation)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [License](#license)

## Overview

The QA Analytics Dashboard serves as the central hub for software quality analysis. It automatically ingests test reports (Playwright, Cypress, JUnit) from CI/CD systems, syncs with bug trackers like Jira, and provides comprehensive reporting via dynamically generated PDF and Excel schedules.

## Documentation

Comprehensive documentation for all aspects of the application can be found in the `docs/` directory:

1. [Architecture Diagram](./docs/architecture.md)
2. [ER Diagram (Database Schema)](./docs/er-diagram.md)
3. [API Documentation](./docs/api-documentation.md)
4. [Installation Guide](./docs/installation.md)
5. [Deployment Guide](./docs/deployment.md)
6. [User Guide](./docs/user-guide.md)

## Key Features

- **Live Dashboard:** Real-time analytics, charts, and metrics via WebSockets (Socket.IO).
- **Automated Ingestion:** Directly parse JUnit, Cypress, and Playwright report artifacts.
- **CI/CD Integrations:** Webhook listeners for Azure DevOps, GitHub Actions, Jenkins, and GitLab CI.
- **Jira Synchronization:** Bi-directional syncing of Defects/Bugs (Status, Assignee).
- **Scheduled Reporting:** Email automated Excel and PDF reports daily, weekly, or monthly.
- **RBAC Security:** Granular Role-Based Access Control (Admin, QA Lead, Tester, Viewer).
- **Enterprise UI/UX:** Material-UI with full dark mode support, skeleton loaders, and React Query API caching.

## Technology Stack

- **Frontend**: React, Vite, Material UI (MUI), Recharts, TanStack Query, Socket.IO Client.
- **Backend**: Node.js, Express, Prisma ORM, Socket.IO, node-cron.
- **Database**: SQLite (Development), PostgreSQL (Production ready).

## Getting Started

Please refer to the [Installation Guide](./docs/installation.md) for local setup instructions.

## License

MIT License. See `LICENSE` for more information.
