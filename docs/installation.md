# Installation Guide

Follow these steps to configure and run the QA Analytics Dashboard locally for development or testing.

## Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)
- **Git**

## 1. Clone the Repository

```bash
git clone <repository_url>
cd qa-analytics-dashboard
```

## 2. Backend Setup (Server)

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Copy the example environment file and modify it as needed.
   ```bash
   cp .env.example .env
   ```
   *Make sure `JWT_SECRET` is set.*
4. Initialize the Database:
   The project uses Prisma and SQLite for local development. Run migrations to build the local database file:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Seed the Database:
   Seed the database with default Admin roles and mock data:
   ```bash
   npm run seed
   ```
6. Start the Server:
   ```bash
   npm run dev
   ```
   The backend should now be running on `http://localhost:5000`.

## 3. Frontend Setup (Client)

1. Open a new terminal tab and navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Development Server:
   ```bash
   npm run dev
   ```
   The frontend UI will be accessible at `http://localhost:5173`.

## 4. Default Login

Once both the client and server are running, navigate to `http://localhost:5173` and log in using the seeded Admin account:
- **Email**: admin@example.com
- **Password**: password123

## Troubleshooting

- **Socket Connection Issues**: Ensure your client is trying to connect to port `5000` and CORS isn't blocking it.
- **Database Errors**: If Prisma complains about schema mismatches, run `npx prisma generate` and `npx prisma migrate reset` to completely wipe and rebuild the local SQLite file.
