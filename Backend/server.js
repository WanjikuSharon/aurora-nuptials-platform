import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import venueRoutes from './routes/venueRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import coupleRoutes from './routes/coupleRoutes.js';
import registryRoute from './routes/registryRoute.js';
import bookingRoute from './routes/bookingRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/couples', coupleRoutes);
app.use('/api/registry', registryRoute);
app.use('/api/bookings', bookingRoute);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Aurora Nuptials Platform API' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});