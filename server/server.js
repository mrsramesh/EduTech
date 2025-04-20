// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const authRoutes = require('./routes/authRoutes');

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use('/api', authRoutes);

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     app.listen(process.env.PORT, () => {
//       console.log(`Server running on http://localhost:${process.env.PORT}`);
//     });
//   })
//   .catch(err => console.error('MongoDB connection error:', err));


const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/Message");
const User = require("./models/User");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

// Track active users
const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  // Handle user joining a room
  socket.on("join_room", async ({ roomId, userId }) => {
    try {
      // Join the room
      socket.join(roomId);
      console.log(`📝 User ${userId} joined room ${roomId}`);
      
      // Add to active users
      activeUsers.set(socket.id, { userId, roomId });
      
      // Update user status in DB
      await User.findByIdAndUpdate(userId, { 
        online: true,
        lastSeen: new Date()
      });
      
      // Notify room that user is online
      socket.to(roomId).emit("user_status", {
        userId,
        status: "online"
      });
      
      // Send last 50 messages
      const messages = await Message.find({ roomId })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
      
      socket.emit("initial_messages", messages.reverse());
      
      // Mark messages as seen
      await Message.updateMany(
        { roomId, receiverId: userId, status: { $ne: "seen" } },
        { $set: { status: "seen" } }
      );
      
      // Emit seen status for these messages
      const unseenMessages = await Message.find({
        roomId,
        receiverId: userId,
        status: "delivered"
      });
      
      unseenMessages.forEach(msg => {
        io.to(msg.senderId).emit("message_status", {
          messageId: msg._id,
          status: "seen",
          roomId
        });
      });
      
    } catch (error) {
      console.error("Error joining room:", error);
    }
  });

  // Handle sending messages
  socket.on("send_message", async (data) => {
    try {
      const { roomId, senderId, receiverId, message } = data;
      
      // Create and save message
      const newMessage = new Message({
        roomId,
        senderId,
        receiverId,
        message,
        status: "sent"
      });
      
      const savedMessage = await newMessage.save();
      
      // Emit to sender that message was sent
      socket.emit("message_status", {
        messageId: savedMessage._id,
        status: "sent",
        roomId
      });
      
      // Check if receiver is online
      const receiverSocket = findSocketByUserId(receiverId);
      
      if (receiverSocket) {
        // Update status to delivered
        await Message.findByIdAndUpdate(savedMessage._id, {
          status: "delivered"
        });
        
        // Emit to receiver
        io.to(receiverSocket.id).emit("receive_message", {
          ...savedMessage.toObject(),
          status: "delivered"
        });
        
        // Emit to sender that message was delivered
        socket.emit("message_status", {
          messageId: savedMessage._id,
          status: "delivered",
          roomId
        });
      } else {
        // If offline, will be marked as delivered when they reconnect
        io.to(roomId).emit("receive_message", savedMessage.toObject());
      }
      
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  // Handle message status updates
  socket.on("message_status", async (data) => {
    try {
      const { messageId, status } = data;
      
      // Update in database
      await Message.findByIdAndUpdate(messageId, { status });
      
      // Forward status update to sender
      const message = await Message.findById(messageId);
      if (message) {
        const senderSocket = findSocketByUserId(message.senderId);
        if (senderSocket) {
          io.to(senderSocket.id).emit("message_status", {
            messageId,
            status,
            roomId: message.roomId
          });
        }
      }
    } catch (error) {
      console.error("Error updating message status:", error);
    }
  });

  // Handle typing indicator
  socket.on("typing", (data) => {
    const { roomId, userId, isTyping } = data;
    socket.to(roomId).emit("typing", { userId, isTyping });
  });

  // Handle disconnection
  socket.on("disconnect", async () => {
    try {
      const userData = activeUsers.get(socket.id);
      if (userData) {
        const { userId, roomId } = userData;
        
        // Update user status in DB
        await User.findByIdAndUpdate(userId, { 
          online: false,
          lastSeen: new Date()
        });
        
        // Notify room that user went offline
        socket.to(roomId).emit("user_status", {
          userId,
          status: "offline"
        });
        
        activeUsers.delete(socket.id);
        console.log(`❌ User ${userId} disconnected from room ${roomId}`);
      }
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  });

  // Helper function to find socket by user ID
  function findSocketByUserId(userId) {
    for (const [socketId, data] of activeUsers.entries()) {
      if (data.userId === userId) {
        return { id: socketId, ...data };
      }
    }
    return null;
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 Server running on port ${PORT}`);
});