import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import photoRoutes from "./routes/photoRoutes.js"; // ✅ update path here

dotenv.config(); // ✅ Load .env first

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(express.json());

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.use("/api/photos", photoRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Welcome to AK Visuals Backend 🎥✨");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
