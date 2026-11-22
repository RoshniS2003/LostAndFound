// backend/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/items.js";

import dns from "dns"

dns.setServers(["1.1.1.1", "8.8.8.8"])

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

app.get('/', (req, res) => res.send('Lost & Found API running'));
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 8000, () => console.log('Server running on port 8000'));
  })
  .catch((e) => console.log(e.message));