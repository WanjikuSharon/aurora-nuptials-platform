import express from 'express';
import { PrismaClient } from '../../generated/prisma/index.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/vendors - Get all vendors by category
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    const where = {};
    if (category) where.category = category;
    
    const vendors = await prisma.vendorProfile.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        venues: true,
        reviews: true
      }
    });
    
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

export default router;