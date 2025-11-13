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

// ✅ CORS Configuration
const allowedOrigins = [
  "http://localhost:3000", // Local frontend (for development)
  "https://ak-visuals-frontend.vercel.app", // Deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin like mobile apps or curl requests
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle preflight requests explicitly
app.options("*", cors());

// ✅ Middleware
app.use(express.json());

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ✅ Routes
app.get("/", (req, res) => {
  res.send("🚀 AKVisuals backend is running...");
});

app.get("/test-cors", (req, res) => {
  res.json({ message: "CORS working fine!" });
});

app.use("/api/photos", photoRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/admin/bookings", verifyAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching bookings." });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
