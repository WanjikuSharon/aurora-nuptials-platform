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
    
    console.log('User created successfully:', user.id);
    
    // Create profile based on role
    if (role === 'COUPLE') {
      console.log('Creating couple profile...');
      await prisma.coupleProfile.create({
        data: {
          userId: user.id
        }
      });
      console.log('Couple profile created');
    } else if (role === 'VENDOR') {
      console.log('Creating vendor profile...');
      await prisma.vendorProfile.create({
        data: {
          userId: user.id,
          businessName: name || 'My Business',
          category: 'VENUE', // Default category
          description: 'Wedding service provider'
        }
      });
      console.log('Vendor profile created');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('Registration completed successfully');
    
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
    res.status(500).json({ error: 'Failed to register user' });
  }
};

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
    
    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

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
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    //console.log('Getting profile for user:', req.user);
    const token = req.cookies.token;

    if (!req.user || !req.user.userId) {
      return res.status(400).json({ error: 'Invalid user data in token' });
    }
    
    console.log('Fetching user with ID:', req.user.userId);
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        coupleProfile: {
          include: {
            weddingRegistry: {
              include: { registryItems: true }
            },
            favorites: {
              include: {
                venue: {
                  select: {
                    id: true,
                    name: true,
                    venueType: true,
                    city: true,
                    priceRange: true
                  }
                },
                vendor: {
                  select: {
                    id: true,
                    businessName: true,
                    category: true
                  }
                }
              }
            }
          }
        },
        vendorProfile: {
          include: {
            venues: true,
            reviews: true
          }
        }
      }
    });
    
    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('User found successfully');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch profile',
      details: error.message 
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, weddingDate, budget, guestCount, theme, businessName, category, description, priceRange } = req.body;
    
    // Update user basic info
    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: { name }
    });
    
    // Update role-specific profile
    if (req.user.role === 'COUPLE') {
      await prisma.coupleProfile.update({
        where: { userId: req.user.userId },
        data: {
          weddingDate: weddingDate ? new Date(weddingDate) : undefined,
          budget: budget ? parseFloat(budget) : undefined,
          guestCount: guestCount ? parseInt(guestCount) : undefined,
          theme
        }
      });
    } else if (req.user.role === 'VENDOR') {
      await prisma.vendorProfile.update({
        where: { userId: req.user.userId },
        data: {
          businessName,
          category,
          description,
          priceRange
        }
      });
    }
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Debug function to test database connectivity
const debugUser = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    res.json({ 
      message: 'Database connected',
      userCount: users.length,
      users: users
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: error.message });
  }
};


//to be deleted
// Add to your authController.js
const debugCouples = async (req, res) => {
  try {
    const couples = await prisma.user.findMany({
      where: { role: 'COUPLE' },
      include: {
        coupleProfile: true
      }
    });
    
    res.json({
      message: 'Debug: All couples',
      couples: couples.map(c => ({
        id: c.id,
        email: c.email,
        name: c.name,
        hasCoupleProfile: !!c.coupleProfile,
        coupleProfileId: c.coupleProfile?.id
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { register, login, getProfile, updateProfile, debugUser, fixVendorProfile, debugCouples };