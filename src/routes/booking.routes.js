import { Router } from "express";
import { z } from "zod";
import { validate } from "../middlewares/validate.js";
import {
  createBooking,
  updateBookingStatus,
  getBookingsByEmail,
  getAllBookings   // ✅ add this
} from "../controllers/booking.controller.js";

const router = Router();

const createBookingSchema = z.object({
  expertId: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8).max(15),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  timeSlot: z.string().regex(/^\d{2}:\d{2}$/, "timeSlot must be HH:mm"),
  notes: z.string().optional().default("")
});

const updateStatusSchema = z.object({
  status: z.enum(["Pending", "Confirmed", "Completed"])
});

// create booking
router.post("/", validate(createBookingSchema), createBooking);

// update status
router.patch("/:id/status", validate(updateStatusSchema), updateBookingStatus);

// user: bookings by email
router.get("/", getBookingsByEmail);

// ✅ ADMIN: get all bookings
router.get("/all", getAllBookings);

export default router;