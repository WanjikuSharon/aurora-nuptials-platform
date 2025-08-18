import express from 'express';
import {
  getRegistry,
  addRegistryItem,
  updateRegistryItem,
  deleteRegistryItem,
  getPublicRegistry,
  purchaseRegistryItem,
  getRegistryCategories,
  getRegistryStats
} from '../controllers/registryController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/categories', getRegistryCategories);                    // GET /api/registry/categories
router.get('/public/:coupleId', getPublicRegistry);                 // GET /api/registry/public/:coupleId
router.post('/items/:itemId/purchase', purchaseRegistryItem);       // POST /api/registry/items/:itemId/purchase

// Protected routes - Couple only
router.get('/', authenticateToken, requireRole(['COUPLE']), getRegistry);                    // GET /api/registry
router.post('/items', authenticateToken, requireRole(['COUPLE']), addRegistryItem);         // POST /api/registry/items
router.put('/items/:id', authenticateToken, requireRole(['COUPLE']), updateRegistryItem);   // PUT /api/registry/items/:id
router.delete('/items/:id', authenticateToken, requireRole(['COUPLE']), deleteRegistryItem); // DELETE /api/registry/items/:id
router.get('/stats', authenticateToken, requireRole(['COUPLE']), getRegistryStats);         // GET /api/registry/stats

export default router;