import express from 'express';
import {
  getVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
  getVenueTypes,
  addToFavorites,
  removeFromFavorites
} from '../controllers/venueController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getVenues);                    // GET /api/venues - Get all venues with filters
router.get('/types', getVenueTypes);          // GET /api/venues/types - Get venue types
router.get('/:id', getVenueById);             // GET /api/venues/:id - Get single venue

// Protected routes - Vendor/Admin only
router.post('/', authenticateToken, createVenue);                    // POST /api/venues - Create venue
router.put('/:id', authenticateToken, updateVenue);                  // PUT /api/venues/:id - Update venue
router.delete('/:id', authenticateToken, deleteVenue);               // DELETE /api/venues/:id - Delete venue

// Protected routes - Couple only  
router.post('/:id/favorites', authenticateToken, addToFavorites);    // POST /api/venues/:id/favorites - Add to favorites
router.delete('/:id/favorites', authenticateToken, removeFromFavorites); // DELETE /api/venues/:id/favorites - Remove from favorites

export default router;