import express from "express";
import dotenv from "dotenv";
import "./dbconnection/index.js";

import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import corsMiddleware from "./config/cors.js";
import sessionMiddleware from "./config/session.js";
import emailScheduler from "./services/emailScheduler.js";
import apiRoutes from "./routes/index.js";

dotenv.config();

const PORT = process.env.PORT;
const app = express();

// Log environment info
console.log("🚀 Starting server...");
console.log("📍 Environment:", process.env.NODE_ENV);
console.log("🔌 Port:", PORT);
console.log("🍪 Secure cookies:", process.env.NODE_ENV === "production");

// Middleware setup
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(corsMiddleware);
app.use(sessionMiddleware);

// API Routes with /api prefix
app.use("/api", apiRoutes);

// Start email scheduler
emailScheduler.start();

// Basic route for server status
app.get("/", (req, res) => {
  res.json({
    message: "CMS Server is running!",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}!`);
});
