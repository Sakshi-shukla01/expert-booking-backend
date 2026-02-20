import { Expert } from "../models/Expert.js";
import { Booking } from "../models/Booking.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateNextDaysSlots } from "../utils/slotGenerator.js";

export const getExperts = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || "10", 10)));
  const category = req.query.category?.trim();
  const search = req.query.search?.trim();

  const filter = {};
  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: "i" };

  const [items, total] = await Promise.all([
    Expert.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Expert.countDocuments(filter)
  ]);

  res.json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    items
  });
});

export const getExpertById = asyncHandler(async (req, res) => {
  const expert = await Expert.findById(req.params.id);
  if (!expert) return res.status(404).json({ message: "Expert not found" });

  const slotsByDate = generateNextDaysSlots(7);
  const dates = Object.keys(slotsByDate);

  const booked = await Booking.find(
    { expertId: expert._id, date: { $in: dates } },
    { date: 1, timeSlot: 1, _id: 0 }
  );

  const bookedMap = {};
  for (const b of booked) {
    if (!bookedMap[b.date]) bookedMap[b.date] = new Set();
    bookedMap[b.date].add(b.timeSlot);
  }

  const availableSlotsByDate = {};
  for (const date of dates) {
    const set = bookedMap[date] || new Set();
    availableSlotsByDate[date] = slotsByDate[date].filter((t) => !set.has(t));
  }

  res.json({ expert, availableSlotsByDate });
});