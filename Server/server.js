import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

import authRoutes from './routes/authRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import counselorRoutes from './routes/counselorRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/counselors', counselorRoutes);
app.use('/api/contact', contactRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
