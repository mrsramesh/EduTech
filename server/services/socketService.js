const Message = require('../models/Message');
const User = require('../models/User');

const activeUsers = new Map();

const initialize = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 New connection:', socket.id);

    // Event handlers
    socket.on('join_room', handleJoinRoom(socket, io));
    socket.on('send_message', handleSendMessage(socket, io));
    socket.on('mark_as_seen', handleMarkAsSeen(socket, io));
    socket.on('typing', handleTyping(socket, io));
    socket.on('disconnect', handleDisconnect(socket, io));
  });
};

// Socket event handlers
const handleJoinRoom = (socket, io) => async ({ roomId, userId }) => {
  try {
    socket.join(roomId);
    activeUsers.set(socket.id, { userId, roomId });

    await User.findByIdAndUpdate(userId, { 
      online: true,
      lastSeen: new Date() 
    });

    // Notify room
    socket.to(roomId).emit('user_status', { userId, status: 'online' });

    // Send initial messages
    const messages = await Message.find({ roomId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    socket.emit('initial_messages', messages.reverse());
  } catch (error) {
    console.error('Join room error:', error);
  }
};

// Other handlers...

module.exports = { initialize };