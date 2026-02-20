import { io } from "socket.io-client";

const expertId = "69980466aa7554451291752a"; // Rohit Jain

const socket = io("http://localhost:5000", {
  transports: ["websocket"]
});

socket.on("connect", () => {
  console.log("✅ connected:", socket.id);
  socket.emit("joinExpert", expertId);
  console.log("✅ joined room:", `expert:${expertId}`);
});

socket.on("slotBooked", (data) => {
  console.log("🔥 slotBooked event received:", data);
});