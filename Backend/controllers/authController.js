import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

// Register new user
const register = async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    
    const { email, name, password, role = 'COUPLE' } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    console.log('Checking if user exists...');
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ error: 'User already exists' });
    }
    
    console.log('Hashing password...');
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('Creating user...');
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role
      }
    });
    
    console.log('User created:', user.id);
    
    // Create profile based on role
    if (role === 'COUPLE') {
      console.log('Creating couple profile...');
      await prisma.coupleProfile.create({
        data: { userId: user.id }
      });
    } else if (role === 'VENDOR') {
      console.log('Creating vendor profile...');
      await prisma.vendorProfile.create({
        data: {
          userId: user.id,
          businessName: name || 'New Business',
          category: 'PHOTOGRAPHER' // Default, can be updated later
        }
      });
    }
    
    console.log('Generating token...', {token});
    // Generate token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('Registration successful');
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed', 
      details: error.message 
    });
  }
});

// Login user
const login = async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    console.log('Finding user...');
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        coupleProfile: true,
        vendorProfile: true
      }
    });
    
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    console.log('Checking password...');
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Invalid password');
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    console.log('Generating token...');
    // Generate token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('Login successful');
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: user.coupleProfile || user.vendorProfile
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Login failed', 
      details: error.message 
    });
  }
},

// Export controller functions
export { register, login };
