import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import gigRoutes from './routes/gigRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

// Load env
dotenv.config();

// Connect DB
connectDB();

const app = express();

// Middleware
app.use(cors());
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

import http from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User connected to WebRTC socket:', socket.id);

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });

  // Relay signaling data
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

server.listen(PORT, () => {
  console.log(`Server & Socket.io running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}`);
});
