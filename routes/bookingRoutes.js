import express from "express";
import Booking from "../models/Booking.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

/**
 * 📩 Create a new booking + send confirmation emails
 */
router.post("/", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();

    // ✅ Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Mail to Admin (you)
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: "📸 New Booking Received - AK Visuals",
      text: `
You have received a new booking!

📌 Booking Details:
----------------------------------
Name: ${booking.name}
Email: ${booking.email}
Phone: ${booking.phone}
Service: ${booking.service}
Shoot Type: ${booking.shootType}
Message: ${booking.message || "N/A"}
Date: ${new Date(booking.createdAt).toLocaleString()}
----------------------------------
      `,
    };

    // ✅ Confirmation mail to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: "🎉 Booking Confirmation - AK Visuals",
      html: `
        <h2 style="color:#ffcc00;">Hi ${booking.name},</h2>
        <p>Thank you for booking with <strong>AK Visuals</strong>!</p>
        <p>We’ve received your booking request for <b>${booking.service}</b> (${booking.shootType}).</p>
        <p>Our team will contact you shortly for further details.</p>
        <hr>
        <p style="color:gray;font-size:0.9rem;">
        📞 Phone: ${booking.phone}<br/>
        ✉️ Email: ${booking.email}<br/>
        📅 Date: ${new Date(booking.createdAt).toLocaleString()}
        </p>
        <p style="margin-top:15px;">Best regards,<br/>Team AK Visuals 📸</p>
      `,
    };

    // ✅ Send both mails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.status(200).json({ message: "Booking submitted successfully!" });
  } catch (error) {
    console.error("❌ Booking error:", error);
    res.status(500).json({
      message: "Server error. Please try again later.",
      error,
    });
  }
});

/**
 * 🧾 Get all bookings (for Admin Dashboard)
 */
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("❌ Fetch bookings error:", error);
    res.status(500).json({ message: "Error fetching bookings", error });
  }
});

/**
 * 🔁 Update booking status (Pending / Completed)
 */
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    // ✅ Validate input
    if (!["Pending", "Completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("❌ Error updating booking status:", error);
    res.status(500).json({
      message: "Error updating booking status",
      error,
    });
  }
});

export default router;
