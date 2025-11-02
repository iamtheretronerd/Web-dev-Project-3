import express from "express";
import dotenv from "dotenv";

import authRoute from "./routes/authRoute.js";

dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const allowedOrigins = ["http://localhost:3000", "http://localhost:5174"];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  
  next();
});

//check in production 
if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
  
  // Handle React routing - send all non-API routes to React
  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.resolve("frontend", "build", "index.html"));
    }
  });
}

// API Routes
app.use("/api/auth", authRoute);

// Health check endpoint for testing
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    message: "LevelUp backend is running",
  });
});

// 404 handler for API routes
app.use(/^\/api\/.*$/, (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested API endpoint does not exist",
  });
});

// Error handling middleware 
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error("Error:", err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});