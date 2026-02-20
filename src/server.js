import "dotenv/config";
import http from "http";
import { Server } from "socket.io";

import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { initSockets } from "./sockets/index.js";

async function start() {
  const server = http.createServer();

  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_ORIGIN, credentials: true }
  });

  initSockets(io);

  const app = createApp(io);
  server.on("request", app);

  await connectDB(process.env.MONGO_URI);

  const port = process.env.PORT || 5000;
  server.listen(port, () => console.log(`🚀 Server running on ${port}`));
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});