import { Server } from 'socket.io';

let io;

export const initSocket = (server, frontendUrl) => {
  io = new Server(server, {
    cors: {
      origin: frontendUrl,
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected to SkillSphere Socket:', socket.id);

    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId);
      socket.to(roomId).emit('user-connected', userId);

      socket.on('disconnect', () => {
        socket.to(roomId).emit('user-disconnected', userId);
      });
    });

    // Relay WebRTC signaling data
    socket.on('offer', (payload) => {
      io.to(payload.target).emit('offer', payload);
    });

    socket.on('answer', (payload) => {
      io.to(payload.target).emit('answer', payload);
    });

    socket.on('ice-candidate', (payload) => {
      io.to(payload.target).emit('ice-candidate', payload);
    });

    // Relay chat messages
    socket.on('send-chat', (roomId, message) => {
      socket.to(roomId).emit('receive-chat', message);
    });
  });

  return io;
};

export const sendNotification = async (userId, notificationData) => {
  try {
    if (!io) {
      console.warn('Socket.io not initialized. Notification saved to DB only.');
    }
    
    // Dynamically import Notification model to avoid circular dependency
    const Notification = (await import('../models/Notification.js')).default;
    const notification = await Notification.create({
      userId,
      ...notificationData
    });
    
    // Push to socket if user is online
    if (io) {
      io.to(userId.toString()).emit('new-notification', notification);
    }
    return notification;
  } catch (error) {
    console.error('Socket notification error:', error);
  }
};
