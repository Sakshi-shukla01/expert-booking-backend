import express from "express";
import cors from "cors";
import morgan from "morgan";

import expertRoutes from "./routes/expert.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export function createApp(io) {
  const app = express();

  // ✅ allow both React ports + Postman
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173"
  ];

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  }));

  app.use(express.json());
  app.use(morgan("dev"));

  // attach socket io
  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  app.get("/health", (req, res) => res.json({ ok: true }));

  app.use("/experts", expertRoutes);
  app.use("/bookings", bookingRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}