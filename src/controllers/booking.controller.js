import { Booking } from "../models/Booking.js";
import { Expert } from "../models/Expert.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createBooking = asyncHandler(async (req, res) => {
  const { expertId, name, email, phone, date, timeSlot, notes } = req.body;

  const expert = await Expert.findById(expertId);
  if (!expert) return res.status(404).json({ message: "Expert not found" });

  // ✅ race-safe via unique index in Booking model
  const booking = await Booking.create({
    expertId, name, email, phone, date, timeSlot, notes
  });

  // ✅ real-time update for everyone viewing that expert
  req.io.to(`expert:${expertId}`).emit("slotBooked", {
    expertId: String(expertId),
    date,
    timeSlot
  });

  res.status(201).json({ message: "Booking successful", booking });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!booking) return res.status(404).json({ message: "Booking not found" });

  res.json({ message: "Status updated", booking });
});

export const getBookingsByEmail = asyncHandler(async (req, res) => {
  const email = (req.query.email || "").toLowerCase().trim();
  if (!email) return res.status(400).json({ message: "email query param is required" });

  const items = await Booking.find({ email })
    .populate("expertId", "name category rating experienceYears")
    .sort({ createdAt: -1 });

  res.json({ items });
});
export const getAllBookings = asyncHandler(async (req, res) => {
  const items = await Booking.find()
    .populate("expertId", "name category rating experienceYears")
    .sort({ createdAt: -1 });

  res.json({ items });
});