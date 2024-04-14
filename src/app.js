import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';

dotenv.config({ path: './.env' });

const app = express();

// Middleware
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.static('public'));
app.use(cookieParser());

// Routes
app.use('/api/v1/users', userRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
});

export default app;
