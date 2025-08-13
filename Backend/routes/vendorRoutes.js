import express from 'express';
import {
  getVendors,
  getVendorById,
  updateVendorProfile,
  getMyProfile,
  getVendorCategories,
  addVendorToFavorites,
  removeVendorFromFavorites,
  verifyVendor
} from '../controllers/vendorController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getVendors);                           // GET /api/vendors - Get all vendors with filters
router.get('/categories', getVendorCategories);       // GET /api/vendors/categories - Get vendor categories
router.get('/:id', getVendorById);                    // GET /api/vendors/:id - Get single vendor

// Protected routes - Vendor only
router.get('/dashboard/profile', authenticateToken, getMyProfile);           // GET /api/vendors/dashboard/profile - Get own profile
router.put('/:id', authenticateToken, updateVendorProfile);                 // PUT /api/vendors/:id - Update vendor profile

// Protected routes - Couple only
router.post('/:id/favorites', authenticateToken, addVendorToFavorites);     // POST /api/vendors/:id/favorites - Add to favorites
router.delete('/:id/favorites', authenticateToken, removeVendorFromFavorites); // DELETE /api/vendors/:id/favorites - Remove from favorites

// Protected routes - Admin only
router.patch('/:id/verify', authenticateToken, requireRole(['ADMIN']), verifyVendor); // PATCH /api/vendors/:id/verify - Verify vendor

export default router;