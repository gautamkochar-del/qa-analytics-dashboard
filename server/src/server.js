import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import listEndpoints from "express-list-endpoints";
import { Server } from "socket.io";
import { initCronJobs } from "./services/cronService.js";

dotenv.config();

console.log("===== REGISTERED ROUTES =====");
console.log(listEndpoints(app));

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

initCronJobs();

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
