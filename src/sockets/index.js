export function initSockets(io) {
  io.on("connection", (socket) => {
    socket.on("joinExpert", (expertId) => {
      if (!expertId) return;
      socket.join(`expert:${expertId}`);
    });

    socket.on("leaveExpert", (expertId) => {
      if (!expertId) return;
      socket.leave(`expert:${expertId}`);
    });
  });
}