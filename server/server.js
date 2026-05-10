import 'dotenv/config';
import express from 'express';

// Environment variable validation
const requiredEnvVars = ['JWT_SECRET', 'SENDGRID_API_KEY', 'MONGO_URI'];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(`CRITICAL ERROR: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

import cors from 'cors';
import http from 'http';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { initSocket } from './utils/socketService.js';
import connectDB from './config/db.js';

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
import User from './models/User.js';

// Connect to Campus Database
connectDB();

const app = express();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "https://skillsphere-c0xl.onrender.com"
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(helmet());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 auth requests per windowMs
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// API Routes
app.use('/api/v1/auth', authLimiter, authRoutes);
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
  res.send('<h1>SkillSphere API is Live! 🚀</h1>');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Socket.io for Real-time Chat & WebRTC
initSocket(server, process.env.FRONTEND_URL || "http://localhost:5173");

// Periodic Database Cleanup Job (Runs every 1 hour)
setInterval(async () => {
  try {
    const now = new Date();
    // Clear expired reset tokens
    await User.updateMany(
      { resetPasswordExpires: { $lt: now } },
      { $unset: { resetPasswordOTP: 1, resetPasswordExpires: 1 } }
    );
    // Remove unverified accounts older than 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await User.deleteMany({
      isVerified: false,
      createdAt: { $lt: yesterday }
    });
    console.log('[CLEANUP] Ran routine database cleanup.');
  } catch (err) {
    console.error('[CLEANUP ERROR]', err);
  }
}, 60 * 60 * 1000); // 1 Hour

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
