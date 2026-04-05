// config/socket.js

function setupSocketIO(io) {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on('join-room', (room) => {
      socket.join(room);
      console.log(`   ${socket.id} joined room: ${room}`);
    });

    socket.on('iot-event', (data) => {
      // Broadcast IoT events to operator room
      io.to('operators').emit('iot-update', data);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
}

module.exports = { setupSocketIO };
