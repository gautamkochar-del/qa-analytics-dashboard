# Deployment Guide

Deploying the QA Analytics Dashboard to a production environment requires compiling the frontend React application into static assets and migrating the backend from SQLite to a robust relational database like PostgreSQL.

## 1. Database Migration (PostgreSQL)

For production, it is highly recommended to replace SQLite with PostgreSQL.

1. Open `server/prisma/schema.prisma`.
2. Change the `provider` in the `datasource` block from `"sqlite"` to `"postgresql"`.
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Update your `.env` file on your production server:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/qa_dashboard_db"
   PORT=5000
   JWT_SECRET="your_very_secure_random_string"
   SMTP_HOST="smtp.mailgun.org"
   SMTP_PORT=587
   SMTP_USER="postmaster@yourdomain.com"
   SMTP_PASS="your_password"
   ```
4. Run Prisma commands to generate the client and migrate the DB:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

## 2. Compiling the Frontend

The React application must be built for production. Vite handles this efficiently.

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Build the static assets:
   ```bash
   npm run build
   ```
   This generates a `dist/` folder containing your minified CSS/JS and `index.html`.

## 3. Serving the Application

You have two primary options for serving the application.

### Option A: Node.js Express (All-in-One)
You can configure the Express backend to serve the compiled frontend static files.
1. Move the `client/dist/` folder into `server/public/`.
2. Ensure your Express app has a catch-all route to serve `index.html`:
   ```javascript
   app.use(express.static(path.join(__dirname, 'public')));
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, 'public', 'index.html'));
   });
   ```
3. Run the Node server using a process manager like **PM2**:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name "qa-dashboard"
   ```

### Option B: NGINX Reverse Proxy (Recommended)
Host the frontend static files using NGINX, and reverse-proxy API and WebSocket traffic to the Node.js backend.

**Sample NGINX Config**:
```nginx
server {
    listen 80;
    server_name dashboard.yourcompany.com;

    # Serve Static React Frontend
    location / {
        root /path/to/qa-analytics-dashboard/client/dist;
        try_files $uri /index.html;
    }

    # Reverse Proxy REST API
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_set_header Host $host;
    }

    # Reverse Proxy Socket.IO (WebSockets)
    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

## 4. CI/CD Pipeline Webhooks Integration
Once deployed, navigate to the **Integrations** page in your dashboard, copy the generated Webhook URLs (e.g., Jenkins, GitHub Actions), and place them in your CI/CD pipeline post-build steps so test results are automatically pushed to your live production server.
