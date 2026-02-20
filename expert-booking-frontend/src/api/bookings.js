import { api } from "./client";

export const createBooking = async (payload) => {
  const { data } = await api.post("/bookings", payload);
  return data;
};

export const fetchBookingsByEmail = async (email) => {
  const { data } = await api.get("/bookings", { params: { email } });
  return data;
};

export const updateBookingStatus = async (bookingId, status) => {
  const { data } = await api.patch(`/bookings/${bookingId}/status`, { status });
  return data;
};

// ✅ ADMIN: fetch all bookings
export const fetchAllBookings = async () => {
  const { data } = await api.get("/bookings/all");
  return data;
};