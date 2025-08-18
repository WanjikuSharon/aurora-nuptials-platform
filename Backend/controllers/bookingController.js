import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

// Create a new booking
const createBooking = async (req, res) => {
  try {
    if (req.user.role !== 'COUPLE') {
      return res.status(403).json({ error: 'Only couples can create bookings' });
    }

    const {
      venueId,
      vendorId,
      eventDate,
      notes
    } = req.body;

    // Validate input
    if (!eventDate) {
      return res.status(400).json({ error: 'Event date is required' });
    }

    if (!venueId && !vendorId) {
      return res.status(400).json({ error: 'Either venue or vendor must be specified' });
    }

    console.log('Creating booking for userId:', req.user.userId);

    // Get couple profile
    const coupleProfile = await prisma.coupleProfile.findUnique({
      where: { userId: req.user.userId }
    });

    if (!coupleProfile) {
      return res.status(404).json({ error: 'Couple profile not found' });
    }

    // Validate venue exists if provided
    if (venueId) {
      const venue = await prisma.venue.findUnique({
        where: { id: parseInt(venueId) }
      });
      
      if (!venue) {
        return res.status(404).json({ error: 'Venue not found' });
      }
    }

    // Validate vendor exists if provided
    if (vendorId) {
      const vendor = await prisma.vendorProfile.findUnique({
        where: { id: parseInt(vendorId) }
      });
      
      if (!vendor) {
        return res.status(404).json({ error: 'Vendor not found' });
      }
    }

    // Check for existing booking on the same date for the same venue/vendor
    const existingBooking = await prisma.booking.findFirst({
      where: {
        AND: [
          { eventDate: new Date(eventDate) },
          {
            OR: [
              { venueId: venueId ? parseInt(venueId) : null },
              { vendorId: vendorId ? parseInt(vendorId) : null }
            ]
          },
          { status: { not: 'cancelled' } }
        ]
      }
    });

    if (existingBooking) {
      return res.status(400).json({ 
        error: 'This venue/vendor is already booked for the selected date' 
      });
    }

    const booking = await prisma.booking.create({
      data: {
        coupleProfileId: coupleProfile.id,
        venueId: venueId ? parseInt(venueId) : null,
        vendorId: vendorId ? parseInt(vendorId) : null,
        eventDate: new Date(eventDate),
        notes,
        status: 'pending'
      },
      include: {
        coupleProfile: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        },
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true,
            venueType: true,
            capacity: true,
            priceRange: true
          }
        },
        vendor: {
          select: {
            id: true,
            businessName: true,
            category: true,
            priceRange: true,
            user: {
              select: { name: true, email: true }
            }
          }
        }
      }
    });

    console.log('Booking created successfully:', booking.id);
    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ 
      error: 'Failed to create booking',
      details: error.message 
    });
  }
};

// Get all bookings with filters
const getBookings = async (req, res) => {
  try {
    const {
      status,
      venueType,
      vendorCategory,
      dateFrom,
      dateTo,
      coupleId, // For vendors to see their bookings
      page = 1,
      limit = 10
    } = req.query;

    let whereClause = {};
    
    // Role-based access control
    if (req.user.role === 'COUPLE') {
      // Couples can only see their own bookings
      const coupleProfile = await prisma.coupleProfile.findUnique({
        where: { userId: req.user.userId }
      });
      
      if (!coupleProfile) {
        return res.status(404).json({ error: 'Couple profile not found' });
      }
      
      whereClause.coupleProfileId = coupleProfile.id;
    } else if (req.user.role === 'VENDOR') {
      // Vendors can only see bookings for their services
      const vendorProfile = await prisma.vendorProfile.findUnique({
        where: { userId: req.user.userId },
        include: { venues: true }
      });
      
      if (!vendorProfile) {
        return res.status(404).json({ error: 'Vendor profile not found' });
      }
      
      const venueIds = vendorProfile.venues.map(v => v.id);
      
      whereClause.OR = [
        { vendorId: vendorProfile.id },
        { venueId: { in: venueIds } }
      ];
    } else if (req.user.role === 'ADMIN') {
      // Admins can see all bookings
      if (coupleId) {
        whereClause.coupleProfileId = parseInt(coupleId);
      }
    }

    // Apply filters
    if (status) {
      whereClause.status = status;
    }

    if (dateFrom || dateTo) {
      whereClause.eventDate = {};
      if (dateFrom) {
        whereClause.eventDate.gte = new Date(dateFrom);
      }
      if (dateTo) {
        whereClause.eventDate.lte = new Date(dateTo);
      }
    }

    // Venue type filter
    if (venueType) {
      whereClause.venue = {
        venueType: venueType
      };
    }

    // Vendor category filter
    if (vendorCategory) {
      whereClause.vendor = {
        category: vendorCategory
      };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [bookings, totalCount] = await Promise.all([
      prisma.booking.findMany({
        where: whereClause,
        include: {
          coupleProfile: {
            include: {
              user: {
                select: { name: true, email: true }
              }
            }
          },
          venue: {
            select: {
              id: true,
              name: true,
              address: true,
              city: true,
              state: true,
              venueType: true,
              capacity: true,
              priceRange: true,
              images: true
            }
          },
          vendor: {
            select: {
              id: true,
              businessName: true,
              category: true,
              priceRange: true,
              user: {
                select: { name: true, email: true }
              }
            }
          }
        },
        orderBy: { eventDate: 'asc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.booking.count({ where: whereClause })
    ]);

    res.json({
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNext: skip + parseInt(limit) < totalCount,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// Get single booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: {
        coupleProfile: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        },
        venue: {
          include: {
            vendor: {
              select: {
                businessName: true,
                user: { select: { name: true, email: true } }
              }
            }
          }
        },
        vendor: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check access permissions
    if (req.user.role === 'COUPLE') {
      const coupleProfile = await prisma.coupleProfile.findUnique({
        where: { userId: req.user.userId }
      });
      
      if (!coupleProfile || booking.coupleProfileId !== coupleProfile.id) {
        return res.status(403).json({ error: 'Not authorized to view this booking' });
      }
    } else if (req.user.role === 'VENDOR') {
      const vendorProfile = await prisma.vendorProfile.findUnique({
        where: { userId: req.user.userId },
        include: { venues: true }
      });
      
      const venueIds = vendorProfile?.venues.map(v => v.id) || [];
      
      if (booking.vendorId !== vendorProfile?.id && !venueIds.includes(booking.venueId)) {
        return res.status(403).json({ error: 'Not authorized to view this booking' });
      }
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: {
        venue: { include: { vendor: true } },
        vendor: true
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check permissions
    let canUpdate = false;
    
    if (req.user.role === 'ADMIN') {
      canUpdate = true;
    } else if (req.user.role === 'COUPLE') {
      // Couples can only cancel their own bookings
      const coupleProfile = await prisma.coupleProfile.findUnique({
        where: { userId: req.user.userId }
      });
      
      canUpdate = coupleProfile && booking.coupleProfileId === coupleProfile.id && status === 'cancelled';
    } else if (req.user.role === 'VENDOR') {
      // Vendors can confirm/complete/cancel bookings for their services
      const vendorProfile = await prisma.vendorProfile.findUnique({
        where: { userId: req.user.userId },
        include: { venues: true }
      });
      
      const venueIds = vendorProfile?.venues.map(v => v.id) || [];
      
      canUpdate = (booking.vendorId === vendorProfile?.id) || 
                  (booking.venue?.vendorId === vendorProfile?.id) ||
                  venueIds.includes(booking.venueId);
    }

    if (!canUpdate) {
      return res.status(403).json({ error: 'Not authorized to update this booking' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: {
        status,
        notes: notes !== undefined ? notes : undefined
      },
      include: {
        coupleProfile: {
          include: {
            user: { select: { name: true, email: true } }
          }
        },
        venue: {
          select: {
            name: true,
            address: true,
            city: true,
            state: true
          }
        },
        vendor: {
          select: {
            businessName: true,
            category: true
          }
        }
      }
    });

    res.json(updatedBooking);
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};

// Delete booking
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check permissions (only couples can delete their own bookings or admins)
    let canDelete = false;
    
    if (req.user.role === 'ADMIN') {
      canDelete = true;
    } else if (req.user.role === 'COUPLE') {
      const coupleProfile = await prisma.coupleProfile.findUnique({
        where: { userId: req.user.userId }
      });
      
      canDelete = coupleProfile && booking.coupleProfileId === coupleProfile.id;
    }

    if (!canDelete) {
      return res.status(403).json({ error: 'Not authorized to delete this booking' });
    }

    await prisma.booking.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};

// Get booking statistics
const getBookingStats = async (req, res) => {
  try {
    let whereClause = {};
    
    // Role-based filtering
    if (req.user.role === 'COUPLE') {
      const coupleProfile = await prisma.coupleProfile.findUnique({
        where: { userId: req.user.userId }
      });
      
      if (!coupleProfile) {
        return res.status(404).json({ error: 'Couple profile not found' });
      }
      
      whereClause.coupleProfileId = coupleProfile.id;
    } else if (req.user.role === 'VENDOR') {
      const vendorProfile = await prisma.vendorProfile.findUnique({
        where: { userId: req.user.userId },
        include: { venues: true }
      });
      
      if (!vendorProfile) {
        return res.status(404).json({ error: 'Vendor profile not found' });
      }
      
      const venueIds = vendorProfile.venues.map(v => v.id);
      
      whereClause.OR = [
        { vendorId: vendorProfile.id },
        { venueId: { in: venueIds } }
      ];
    }

    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      completedBookings,
      upcomingBookings
    ] = await Promise.all([
      prisma.booking.count({ where: whereClause }),
      prisma.booking.count({ where: { ...whereClause, status: 'pending' } }),
      prisma.booking.count({ where: { ...whereClause, status: 'confirmed' } }),
      prisma.booking.count({ where: { ...whereClause, status: 'cancelled' } }),
      prisma.booking.count({ where: { ...whereClause, status: 'completed' } }),
      prisma.booking.count({
        where: {
          ...whereClause,
          eventDate: { gte: new Date() },
          status: { not: 'cancelled' }
        }
      })
    ]);

    // Monthly booking trends (last 12 months)
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthlyCount = await prisma.booking.count({
        where: {
          ...whereClause,
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        }
      });

      monthlyData.push({
        month: startOfMonth.toISOString().slice(0, 7), // YYYY-MM format
        count: monthlyCount
      });
    }

    res.json({
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      completedBookings,
      upcomingBookings,
      monthlyTrends: monthlyData
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({ error: 'Failed to fetch booking statistics' });
  }
};

// Check availability for a venue/vendor on a specific date
const checkAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    const { venueId, vendorId } = req.params;

    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }

    const targetDate = new Date(date);
    
    let whereClause = {
      eventDate: targetDate,
      status: { not: 'cancelled' }
    };

    if (venueId) {
      whereClause.venueId = parseInt(venueId);
    } else if (vendorId) {
      whereClause.vendorId = parseInt(vendorId);
    } else {
      return res.status(400).json({ error: 'Either venueId or vendorId must be provided' });
    }

    const existingBooking = await prisma.booking.findFirst({
      where: whereClause,
      include: {
        coupleProfile: {
          include: {
            user: { select: { name: true } }
          }
        }
      }
    });

    const isAvailable = !existingBooking;

    res.json({
      date: targetDate.toISOString().split('T')[0],
      available: isAvailable,
      booking: existingBooking ? {
        id: existingBooking.id,
        coupleName: existingBooking.coupleProfile.user.name,
        status: existingBooking.status
      } : null
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({ error: 'Failed to check availability' });
  }
};

export {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  getBookingStats,
  checkAvailability
};