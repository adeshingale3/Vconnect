import http from "http";
import express from "express";
import path from "path";
import { Server } from "socket.io";
import mongoose from 'mongoose';
import ChatMessage from './models/ChatMessage.js';
import EventParticipant from './models/EventParticipant.js';
import { verifyToken } from './middleware/auth.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"],
  },
});

app.use(express.static(path.resolve("./public")));
app.use(express.json());

// Middleware to authenticate socket connections
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    const decoded = verifyToken(token);
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
});

// Store active chat rooms and their participants
const eventChatRooms = new Map();

io.on("connection", async (socket) => {
  console.log("A user connected");

  // Handle joining event-specific chat room
  socket.on("join-event-chat", async ({ eventId }) => {
    try {
      // Verify if user is participant or organizer
      const participant = await EventParticipant.findOne({
        eventId,
        userId: socket.user._id
      });

      if (!participant) {
        socket.emit('error', { message: 'Access denied' });
        return;
      }

      // Join the event-specific room
      socket.join(`event-${eventId}`);
      
      // Add to active participants
      if (!eventChatRooms.has(eventId)) {
        eventChatRooms.set(eventId, new Set());
      }
      eventChatRooms.get(eventId).add(socket.user._id);

      // Broadcast to room that user joined
      io.to(`event-${eventId}`).emit("user-joined", {
        message: `${socket.user.name} joined the chat`,
        timestamp: new Date(),
        system: true
      });
    } catch (error) {
      console.error('Join chat error:', error);
      socket.emit('error', { message: 'Failed to join chat' });
    }
  });

  // Handle event-specific messages
  socket.on("event-message", async ({ eventId, message }) => {
    try {
      // Verify access again
      const participant = await EventParticipant.findOne({
        eventId,
        userId: socket.user._id
      });

      if (!participant) {
        socket.emit('error', { message: 'Access denied' });
        return;
      }

      // Create and save message
      const chatMessage = new ChatMessage({
        eventId,
        userId: socket.user._id,
        message
      });
      await chatMessage.save();

      // Broadcast message
      io.to(`event-${eventId}`).emit("new-message", {
        message,
        userId: socket.user._id,
        userName: socket.user.name,
        timestamp: new Date(),
        messageId: chatMessage._id
      });
    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on("disconnect", () => {
    // Remove user from active participants in all rooms
    eventChatRooms.forEach((participants, eventId) => {
      if (participants.has(socket.user._id)) {
        participants.delete(socket.user._id);
        io.to(`event-${eventId}`).emit("user-left", {
          message: `${socket.user.name} left the chat`,
          timestamp: new Date(),
          system: true
        });
      }
    });
    console.log("A user disconnected");
  });
});

const PORT = 9000;
server.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
