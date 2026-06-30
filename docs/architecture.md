# Architecture Diagram

The QA Analytics Dashboard uses a standard modern multi-tier web application architecture.

```mermaid
graph TD
    %% Users
    U[Users / Browsers] --> |HTTP / WebSocket| LB(Vite Dev Server / NGINX)
    
    %% CI/CD & Third Party Systems
    CI[CI/CD Pipelines: Jenkins, GitHub, GitLab] --> |HTTP POST / Webhooks| Express
    Jira[Atlassian Jira API] <--> |HTTP REST| Express
    
    %% Frontend (Client)
    subgraph Frontend [React Frontend]
        LB --> ReactApp[React App]
        ReactApp --> UI[Material UI Components]
        ReactApp --> State[React Context & TanStack Query]
        ReactApp --> Router[React Router]
        ReactApp --> SocketClient[Socket.IO Client]
    end
    
    %% Backend (Server)
    subgraph Backend [Node.js Backend]
        ReactApp --> |REST API| Express[Express.js App]
        SocketClient <--> |WebSocket| SocketServer[Socket.IO Server]
        
        Express --> Auth[JWT & RBAC Middleware]
        Express --> Controllers[Controllers & Routing]
        Controllers --> Services[Business Logic Services]
        
        Services --> Prisma[Prisma ORM]
        
        %% Scheduled Jobs
        Cron[Node-Cron Scheduler] --> Services
    end
    
    %% Database
    subgraph Database [Storage Layer]
        Prisma --> SQLite[(SQLite / PostgreSQL Database)]
    end
```

## Component Breakdown

1. **Client Tier**: A React 19 application utilizing Material UI for styling, Recharts for data visualization, and TanStack Query (React Query) for API caching. 
2. **Application Tier**: A Node.js / Express backend providing RESTful APIs. It manages business logic, automated background scheduling (`node-cron`), and integrates directly with external services like Ethereal Email (SMTP) and Jira.
3. **Data Tier**: Prisma ORM maps Node.js objects to the SQL Database (SQLite for local dev, PostgreSQL for production), ensuring type safety and enforcing referential integrity.
4. **Real-time Pipeline**: Socket.IO enables a bidirectional event pipeline between the Application Tier and the Client Tier, driving live, frictionless dashboard updates.
