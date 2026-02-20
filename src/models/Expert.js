import mongoose from "mongoose";

const expertSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    experienceYears: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5 },
    bio: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Expert = mongoose.model("Expert", expertSchema);