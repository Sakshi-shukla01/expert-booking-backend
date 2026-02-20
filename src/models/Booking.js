import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    expertId: { type: mongoose.Schema.Types.ObjectId, ref: "Expert", required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    date: { type: String, required: true },     // YYYY-MM-DD
    timeSlot: { type: String, required: true }, // HH:mm
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

// ✅ DB-level lock: prevents same expert+date+time twice
bookingSchema.index({ expertId: 1, date: 1, timeSlot: 1 }, { unique: true });

export const Booking = mongoose.model("Booking", bookingSchema);