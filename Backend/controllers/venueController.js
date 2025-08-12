import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

// Get all venues with advanced filtering
const getVenues = async (req, res) => {
  try {
    const { 
      venueType, 
      city, 
      state,
      capacity, 
      priceRange,
      amenities,
      search,
      page = 1,
      limit = 12
    } = req.query;
    
    const where = {};
    
    // Filter by venue type
    if (venueType) {
      where.venueType = venueType;
    }
    
    // Filter by location
    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }
    
    if (state) {
      where.state = { contains: state, mode: 'insensitive' };
    }
    
    // Filter by capacity
    if (capacity) {
      where.capacity = { gte: parseInt(capacity) };
    }
    
    // Filter by price range
    if (priceRange) {
      where.priceRange = priceRange;
    }
    
    // Filter by amenities (array search)
    if (amenities) {
      const amenityArray = amenities.split(',');
      where.amenities = {
        hasSome: amenityArray
      };
    }
    
    // Search functionality
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get venues with pagination
    const [venues, totalCount] = await Promise.all([
      prisma.venue.findMany({
        where,
        include: {
          vendor: {
            select: {
              id: true,
              businessName: true,
              verified: true,
              user: {
                select: { name: true, email: true }
              }
            }
          },
          favorites: {
            select: { id: true }
          },
          bookings: {
            select: { id: true, status: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.venue.count({ where })
    ]);
    
    res.json({
      venues,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNext: skip + parseInt(limit) < totalCount,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get venues error:', error);
    res.status(500).json({ error: 'Failed to fetch venues' });
  }
};

// Get single venue by ID
const getVenueById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const venue = await prisma.venue.findUnique({
      where: { id: parseInt(id) },
      include: {
        vendor: {
          include: {
            user: {
              select: { name: true, email: true }
            },
            reviews: {
              select: {
                id: true,
                rating: true,
                comment: true,
                reviewerName: true,
                createdAt: true
              }
            }
          }
        },
        favorites: {
          include: {
            coupleProfile: {
              include: {
                user: {
                  select: { name: true }
                }
              }
            }
          }
        },
        bookings: {
          where: {
            status: { not: 'cancelled' }
          },
          select: {
            eventDate: true,
            status: true
          }
        }
      }
    });
    
    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    
    res.json(venue);
  } catch (error) {
    console.error('Get venue by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch venue' });
  }
};

// Create new venue (Vendor/Admin only)
const createVenue = async (req, res) => {
  try {
    const {
      name,
      description,
      venueType,
      address,
      city,
      state,
      zipCode,
      capacity,
      priceRange,
      amenities,
      images,
      availability
    } = req.body;
    
    // Validate required fields
    if (!name || !venueType || !address || !city || !state) {
      return res.status(400).json({ 
        error: 'Name, venue type, address, city, and state are required' 
      });
    }
    
    // Check if user is vendor or admin
    if (req.user.role !== 'VENDOR' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only vendors and admins can create venues' });
    }
    
    // Get vendor profile ID if user is vendor
    let vendorId = null;
    if (req.user.role === 'VENDOR') {
      const vendorProfile = await prisma.vendorProfile.findUnique({
        where: { userId: req.user.userId }
      });
      
      if (!vendorProfile) {
        return res.status(400).json({ error: 'Vendor profile not found' });
      }
      
      vendorId = vendorProfile.id;
    }
    
    const venue = await prisma.venue.create({
      data: {
        name,
        description,
        venueType,
        address,
        city,
        state,
        zipCode,
        capacity: capacity ? parseInt(capacity) : null,
        priceRange,
        amenities: amenities || [],
        images: images || [],
        availability,
        vendorId
      },
      include: {
        vendor: {
          select: {
            businessName: true,
            verified: true
          }
        }
      }
    });
    
    res.status(201).json(venue);
  } catch (error) {
    console.error('Create venue error:', error);
    res.status(500).json({ error: 'Failed to create venue' });
  }
};

// Update venue (Owner/Admin only)
const updateVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      venueType,
      address,
      city,
      state,
      zipCode,
      capacity,
      priceRange,
      amenities,
      images,
      availability
    } = req.body;
    
    // Check if venue exists
    const existingVenue = await prisma.venue.findUnique({
      where: { id: parseInt(id) },
      include: { vendor: true }
    });
    
    if (!existingVenue) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    
    // Check permissions (venue owner or admin)
    if (req.user.role !== 'ADMIN' && 
        (!existingVenue.vendor || existingVenue.vendor.userId !== req.user.userId)) {
      return res.status(403).json({ error: 'Not authorized to update this venue' });
    }
    
    const updatedVenue = await prisma.venue.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        venueType,
        address,
        city,
        state,
        zipCode,
        capacity: capacity ? parseInt(capacity) : undefined,
        priceRange,
        amenities,
        images,
        availability
      },
      include: {
        vendor: {
          select: {
            businessName: true,
            verified: true
          }
        }
      }
    });
    
    res.json(updatedVenue);
  } catch (error) {
    console.error('Update venue error:', error);
    res.status(500).json({ error: 'Failed to update venue' });
  }
};

// Delete venue (Owner/Admin only)
const deleteVenue = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if venue exists
    const existingVenue = await prisma.venue.findUnique({
      where: { id: parseInt(id) },
      include: { vendor: true }
    });
    
    if (!existingVenue) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    
    // Check permissions (venue owner or admin)
    if (req.user.role !== 'ADMIN' && 
        (!existingVenue.vendor || existingVenue.vendor.userId !== req.user.userId)) {
      return res.status(403).json({ error: 'Not authorized to delete this venue' });
    }
    
    // Check if venue has active bookings
    const activeBookings = await prisma.booking.findMany({
      where: {
        venueId: parseInt(id),
        status: { not: 'cancelled' },
        eventDate: { gte: new Date() }
      }
    });
    
    if (activeBookings.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete venue with active bookings' 
      });
    }
    
    await prisma.venue.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Venue deleted successfully' });
  } catch (error) {
    console.error('Delete venue error:', error);
    res.status(500).json({ error: 'Failed to delete venue' });
  }
};

// Get venue types for filters
const getVenueTypes = async (req, res) => {
  try {
    const venueTypes = Object.values(await import('../../generated/prisma/index.js')).find(
      item => item.VenueType
    );
    
    // Return the enum values
    const types = [
      'OUTDOOR',
      'INTIMATE', 
      'BEACH_WATERFRONT',
      'BARN',
      'ESTATE',
      'VINEYARD',
      'ALL_INCLUSIVE',
      'REHEARSAL_DINNER',
      'WEDDING_SHOWER'
    ];
    
    res.json(types);
  } catch (error) {
    console.error('Get venue types error:', error);
    res.status(500).json({ error: 'Failed to fetch venue types' });
  }
};

// Add venue to favorites (Couple only)
const addToFavorites = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (req.user.role !== 'COUPLE') {
      return res.status(403).json({ error: 'Only couples can add venues to favorites' });
    }
    
    // Get couple profile
    const coupleProfile = await prisma.coupleProfile.findUnique({
      where: { userId: req.user.userId }
    });
    
    if (!coupleProfile) {
      return res.status(400).json({ error: 'Couple profile not found' });
    }
    
    // Check if venue exists
    const venue = await prisma.venue.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    
    // Check if already in favorites
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        coupleProfileId_venueId: {
          coupleProfileId: coupleProfile.id,
          venueId: parseInt(id)
        }
      }
    });
    
    if (existingFavorite) {
      return res.status(400).json({ error: 'Venue already in favorites' });
    }
    
    const favorite = await prisma.favorite.create({
      data: {
        coupleProfileId: coupleProfile.id,
        venueId: parseInt(id)
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            city: true,
            venueType: true,
            priceRange: true,
            images: true
          }
        }
      }
    });
    
    res.status(201).json(favorite);
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({ error: 'Failed to add venue to favorites' });
  }
};

// Remove venue from favorites
const removeFromFavorites = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (req.user.role !== 'COUPLE') {
      return res.status(403).json({ error: 'Only couples can remove venues from favorites' });
    }
    
    // Get couple profile
    const coupleProfile = await prisma.coupleProfile.findUnique({
      where: { userId: req.user.userId }
    });
    
    if (!coupleProfile) {
      return res.status(400).json({ error: 'Couple profile not found' });
    }
    
    const favorite = await prisma.favorite.findUnique({
      where: {
        coupleProfileId_venueId: {
          coupleProfileId: coupleProfile.id,
          venueId: parseInt(id)
        }
      }
    });
    
    if (!favorite) {
      return res.status(404).json({ error: 'Venue not in favorites' });
    }
    
    await prisma.favorite.delete({
      where: { id: favorite.id }
    });
    
    res.json({ message: 'Venue removed from favorites' });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({ error: 'Failed to remove venue from favorites' });
  }
};

export {
  getVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
  getVenueTypes,
  addToFavorites,
  removeFromFavorites
};