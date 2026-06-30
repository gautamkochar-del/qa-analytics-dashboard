# Entity-Relationship (ER) Diagram

The QA Analytics Dashboard database model is managed via Prisma ORM. Below is the structural representation of the core data entities and their relationships.

```mermaid
erDiagram
    User ||--o{ Bug : "assigned"
    User ||--o{ AuditLog : "generates"
    User ||--o{ ReportSchedule : "creates"
    User ||--o{ FilterPreset : "owns"
    User ||--o{ Integration : "configures"
    User }|--o| Department : "belongs to"
    User }|--o| Team : "belongs to"
    User }|--o| Role : "assigned"

    Role ||--o{ RolePermission : "has"
    Permission ||--o{ RolePermission : "granted to"

    Project ||--o{ TestRun : "has"
    Project ||--o{ Bug : "tracks"

    ReportSchedule ||--o{ ReportHistory : "logs"

    Department ||--o{ Team : "contains"

    User {
        Int id PK
        String name
        String email
        String password
        Boolean isActive
        Int departmentId FK
        Int teamId FK
        Int roleId FK
    }

    Project {
        Int id PK
        String name
        String status
    }

    TestRun {
        Int id PK
        Int projectId FK
        String suiteName
        String status
        Int total
        Int passed
        Int failed
    }

    Bug {
        Int id PK
        String title
        String severity
        String status
        Int projectId FK
        Int assigneeId FK
        String jiraIssueKey
    }

    Integration {
        Int id PK
        String provider
        String apiKey
        Int userId FK
    }
```

## Key Modules

- **RBAC (Role-Based Access Control)**: `User`, `Role`, `Permission`, `RolePermission`. Maps complex hierarchical enterprise roles down to granular action/resource constraints.
- **Tracking Core**: `Project`, `TestRun`, `Bug`. The central nexus of analytics containing all testing execution statistics and defect details.
- **Reporting**: `ReportSchedule`, `ReportHistory`. Manages automated cron-based background jobs for PDF/Excel distributions.
