import express from 'express';
import {
  getDashboard,
  updateProfile,
  getFavorites,
  getBookings,
  getWeddingTimeline
} from '../controllers/coupleController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require COUPLE role
router.get('/dashboard', authenticateToken, requireRole(['COUPLE']), getDashboard);
router.put('/profile', authenticateToken, requireRole(['COUPLE']), updateProfile);
router.get('/favorites', authenticateToken, requireRole(['COUPLE']), getFavorites);
router.get('/bookings', authenticateToken, requireRole(['COUPLE']), getBookings);
router.get('/timeline', authenticateToken, requireRole(['COUPLE']), getWeddingTimeline);

export default router;