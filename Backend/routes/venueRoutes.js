import express from 'express';
import { PrismaClient } from '../../generated/prisma/index.js';

const router = express.Router();
const prisma = new PrismaClient();

// Define your routes here
//GET /api/venues -  Get all venues
router.get('/', async (req, res) => {
  try {
    const { venueType, city, capacity, priceRange } = req.query;
    
    const where = {};
    if (venueType) where.venueType = venueType;
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (capacity) where.capacity = { gte: parseInt(capacity) };
    
    const venues = await prisma.venue.findMany({
      where,
      include: {
        vendor: {
          select: { businessName: true, verified: true }
        }
        }
    });
      
      res.json(venues);
  } catch (error) {
      (500).json({ error: 'Failed to fetch venues' });
    }
});
// POST /api/venues - Create a new venue
router.post('/', async (req, res) => {
  try {
    const { name, venueType, city, capacity, priceRange, vendorId } = req.body;
    
    const newVenue = await prisma.venue.create({
      data: {
        name,
        venueType,
        city,
        capacity: parseInt(capacity),
        priceRange,
        vendor: { connect: { id: vendorId } }
      }
    });
    
    res.status(201).json(newVenue);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create venue' });
  }
});

// GET /api/venues/:id - Get a specific venue by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const venue = await prisma.venue.findUnique({
        where: { id: parseInt(id) },
        include: {
            vendor: {
            select: { businessName: true, verified: true }
            }
        }
        });
        
        if (!venue) {
        return res.status(404).json({ error: 'Venue not found' });
        }
        
        res.json(venue);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch venue' });
    }
});
    

export default router;