import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import Notification from './models/Notification.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import gigRoutes from './routes/gigRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

// Connect DB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/skills', skillRoutes);
app.use('/api/v1/gigs', gigRoutes);
app.use('/api/v1/chats', chatRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/matches', matchRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/reviews', reviewRoutes);

app.get('/', (req, res) => {
  res.send('<h1>Server is running! 🚀</h1><p>Welcome to the SkillSphere API Backend.</p>');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Map of userId to socketId for notifications
const userSockets = new Map();

io.on('connection', (socket) => {
  console.log('User connected to socket:', socket.id);

  socket.on('register-user', (userId) => {
    socket.join(userId);
    userSockets.set(userId, socket.id);
    console.log(`User ${userId} registered for notifications`);
  });

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
      for (const [uid, sid] of userSockets.entries()) {
        if (sid === socket.id) {
          userSockets.delete(uid);
          break;
        }
      }
    });
  });

  socket.on('offer', (payload) => {
    io.to(payload.target).emit('offer', payload);
  });

  socket.on('answer', (payload) => {
    io.to(payload.target).emit('answer', payload);
  });

  socket.on('ice-candidate', (payload) => {
    io.to(payload.target).emit('ice-candidate', payload);
  });

  socket.on('send-chat', (roomId, message) => {
    socket.to(roomId).emit('receive-chat', message);
  });
});

export const sendNotification = async (userId, notificationData) => {
  try {
    const notification = await Notification.create({
      userId,
      ...notificationData
    });
    io.to(userId.toString()).emit('new-notification', notification);
    return notification;
  } catch (error) {
    console.error('Socket notification error:', error);
  }
};

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
  } else {
    console.error('Server error:', error);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server & Socket.io running on port ${PORT}`);
});
