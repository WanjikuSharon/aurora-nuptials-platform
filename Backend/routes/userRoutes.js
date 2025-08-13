import express from 'express';
import { login, register, getProfile, updateProfile, debugUser, debugCouples, fixCoupleProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/debug', debugUser);
router.get('/debug-couples', debugCouples);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.post('/fix-couple-profile', authenticateToken, fixCoupleProfile);

export default router;