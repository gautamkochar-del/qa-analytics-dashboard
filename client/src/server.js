import dotenv from "dotenv";
import app from "./app.js";
import listEndpoints from "express-list-endpoints";

dotenv.config();

console.log("===== REGISTERED ROUTES =====");
console.log(listEndpoints(app));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
