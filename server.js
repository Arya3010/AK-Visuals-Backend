import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import photoRoutes from "./routes/photoRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { verifyAdmin } from "./middleware/authMiddleware.js";
import Booking from "./models/Booking.js";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ CORS setup (Express 5 safe)
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://ak-visuals-frontend.onrender.com", // Add your frontend deployed link here
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions)); // ✅ handles preflight automatically

// ✅ Test route for CORS
app.get("/test-cors", (req, res) => {
  res.json({ message: "CORS works!" });
});

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🚀 AKVisuals backend is running...");
});

// ✅ Main API routes
app.use("/api/photos", photoRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Protected Admin Bookings Route
app.get("/api/admin/bookings", verifyAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res.status(500).json({ message: "Server error fetching bookings." });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
