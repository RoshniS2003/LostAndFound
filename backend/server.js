
import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/items.js";
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Lost & Found API running");
});

// Health check route for Render
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "Server is running" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

// Connect MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("MongoDB connected");

    // Render automatically provides PORT
    const PORT = process.env.PORT || 8000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
