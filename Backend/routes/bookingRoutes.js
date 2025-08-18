import express from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  getBookingStats,
  checkAvailability
} from '../controllers/bookingController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/venues/:venueId/availability', checkAvailability);     // GET /api/bookings/venues/:venueId/availability
router.get('/vendors/:vendorId/availability', checkAvailability);   // GET /api/bookings/vendors/:vendorId/availability

// Protected routes - All authenticated users
router.get('/', authenticateToken, getBookings);                    // GET /api/bookings
router.get('/stats', authenticateToken, getBookingStats);           // GET /api/bookings/stats
router.get('/:id', authenticateToken, getBookingById);              // GET /api/bookings/:id

// Protected routes - Couple only
router.post('/', authenticateToken, requireRole(['COUPLE']), createBooking);        // POST /api/bookings
router.delete('/:id', authenticateToken, requireRole(['COUPLE', 'ADMIN']), deleteBooking); // DELETE /api/bookings/:id

// Protected routes - Vendors and Admins can update status
router.patch('/:id/status', authenticateToken, requireRole(['VENDOR', 'ADMIN', 'COUPLE']), updateBookingStatus); // PATCH /api/bookings/:id/status

export default router;