export const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err);

  if (err?.code === 11000) {
    return res.status(409).json({
      message: "Slot already booked. Please choose another time."
    });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error"
  });
};