
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import { PrismaClient } from '../generated/prisma/index.js';
import userRoutes from './routes/userRoutes.js';
//import listEndpoints from 'express-list-endpoints';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// CORS configuration to allow cookies
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add logging middleware to track all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', req.body);
  }
  next();
});

app.use(express.json());
app.use(cookieParser()); // Enable cookie parsing

// Routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 8000;

app.get('/', async (req, res) => { 
  res.send('Backend server is running!');
});

app.listen(PORT, () => {
  console.log(`Server listening on PORT:${PORT}`);
});


