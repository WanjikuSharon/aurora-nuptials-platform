import express from 'express';
import { login, register } from '../controllers/authController.js';

const router = express.Router();

//Routes for user authentication
router.post('/register', register)
    

// Routes for user login
router.post('/login', login)

export default router;