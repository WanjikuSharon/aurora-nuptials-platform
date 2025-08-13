import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

// Get couple's dashboard data
const getDashboard = async (req, res) => {
  try {
    if (req.user.role !== 'COUPLE') {
      return res.status(403).json({ error: 'Only couples can access dashboard' });
    }

    const coupleProfile = await prisma.coupleProfile.findUnique({
      where: { userId: req.user.userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
          }
        },
        weddingRegistry: {
          include: {
            registryItems: {
              orderBy: { createdAt: 'desc' },
              take: 5 // Latest 5 items
            }
          }
        },
        favorites: {
          include: {
            venue: {
              select: {
                id: true,
                name: true,
                city: true,
                state: true,
                venueType: true,
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
                verified: true
              }
            }
          }
        },
        bookings: {
          include: {
            venue: {
              select: {
                id: true,
                name: true,
                city: true,
                state: true,
                venueType: true
              }
            },
            vendor: {
              select: {
                id: true,
                businessName: true,
                category: true
              }
            }
          },
          orderBy: { eventDate: 'asc' }
        }
      }
    });

    if (!coupleProfile) {
      return res.status(404).json({ error: 'Couple profile not found' });
    }

    // Calculate dashboard statistics
    const stats = {
      totalFavorites: coupleProfile.favorites.length,
      favoriteVenues: coupleProfile.favorites.filter(f => f.venue).length,
      favoriteVendors: coupleProfile.favorites.filter(f => f.vendor).length,
      totalBookings: coupleProfile.bookings.length,
      pendingBookings: coupleProfile.bookings.filter(b => b.status === 'pending').length,
      confirmedBookings: coupleProfile.bookings.filter(b => b.status === 'confirmed').length,
      registryItems: coupleProfile.weddingRegistry?.registryItems?.length || 0,
      daysUntilWedding: coupleProfile.weddingDate 
        ? Math.ceil((new Date(coupleProfile.weddingDate) - new Date()) / (1000 * 60 * 60 * 24))
        : null
    };

    // Get upcoming events/bookings
    const upcomingEvents = coupleProfile.bookings
      .filter(booking => new Date(booking.eventDate) >= new Date())
      .slice(0, 3);

    // Wedding planning progress
    const weddingProgress = calculateWeddingProgress(coupleProfile);

    res.json({
      profile: coupleProfile,
      stats,
      upcomingEvents,
      weddingProgress,
      recentRegistryItems: coupleProfile.weddingRegistry?.registryItems || []
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

// Update couple profile
const updateProfile = async (req, res) => {
  try {
    if (req.user.role !== 'COUPLE') {
      return res.status(403).json({ error: 'Only couples can update their profile' });
    }

    const {
      weddingDate,
      budget,
      guestCount,
      theme,
      venue,
      notes
    } = req.body;

    // Update user basic info if provided
    if (req.body.name) {
      await prisma.user.update({
        where: { id: req.user.userId },
        data: { name: req.body.name }
      });
    }

    // Update couple profile
    const updatedProfile = await prisma.coupleProfile.update({
      where: { userId: req.user.userId },
      data: {
        weddingDate: weddingDate ? new Date(weddingDate) : undefined,
        budget: budget ? parseFloat(budget) : undefined,
        guestCount: guestCount ? parseInt(guestCount) : undefined,
        theme,
        venue,
        notes
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json(updatedProfile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Get all favorites
const getFavorites = async (req, res) => {
  try {
    if (req.user.role !== 'COUPLE') {
      return res.status(403).json({ error: 'Only couples can view favorites' });
    }

    const { type } = req.query; // 'venues', 'vendors', or 'all'

    const coupleProfile = await prisma.coupleProfile.findUnique({
      where: { userId: req.user.userId }
    });

    if (!coupleProfile) {
      return res.status(404).json({ error: 'Couple profile not found' });
    }

    const whereClause = { coupleProfileId: coupleProfile.id };
    
    // Filter by type if specified
    if (type === 'venues') {
      whereClause.venueId = { not: null };
    } else if (type === 'vendors') {
      whereClause.vendorId = { not: null };
    }

    const favorites = await prisma.favorite.findMany({
      where: whereClause,
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            description: true,
            city: true,
            state: true,
            venueType: true,
            capacity: true,
            priceRange: true,
            images: true,
            vendor: {
              select: {
                businessName: true,
                verified: true
              }
            }
          }
        },
        vendor: {
          select: {
            id: true,
            businessName: true,
            category: true,
            description: true,
            priceRange: true,
            verified: true,
            user: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      favorites,
      counts: {
        total: favorites.length,
        venues: favorites.filter(f => f.venue).length,
        vendors: favorites.filter(f => f.vendor).length
      }
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};

// Get couple's bookings
const getBookings = async (req, res) => {
  try {
    if (req.user.role !== 'COUPLE') {
      return res.status(403).json({ error: 'Only couples can view bookings' });
    }

    const { status } = req.query; // 'pending', 'confirmed', 'cancelled', or 'all'

    const coupleProfile = await prisma.coupleProfile.findUnique({
      where: { userId: req.user.userId }
    });

    if (!coupleProfile) {
      return res.status(404).json({ error: 'Couple profile not found' });
    }

    const whereClause = { coupleProfileId: coupleProfile.id };
    
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true,
            venueType: true,
            images: true
          }
        },
        vendor: {
          select: {
            id: true,
            businessName: true,
            category: true,
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { eventDate: 'asc' }
    });

    // Group bookings by status for summary
    const bookingSummary = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      upcoming: bookings.filter(b => new Date(b.eventDate) >= new Date()).length
    };

    res.json({
      bookings,
      summary: bookingSummary
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// Get wedding planning checklist/timeline
const getWeddingTimeline = async (req, res) => {
  try {
    if (req.user.role !== 'COUPLE') {
      return res.status(403).json({ error: 'Only couples can view wedding timeline' });
    }

    const coupleProfile = await prisma.coupleProfile.findUnique({
      where: { userId: req.user.userId },
      include: {
        bookings: {
          select: {
            eventDate: true,
            status: true,
            venue: { select: { name: true } },
            vendor: { select: { businessName: true, category: true } }
          }
        }
      }
    });

    if (!coupleProfile) {
      return res.status(404).json({ error: 'Couple profile not found' });
    }

    // Generate timeline based on wedding date
    const timeline = generateWeddingTimeline(coupleProfile.weddingDate, coupleProfile.bookings);

    res.json({
      weddingDate: coupleProfile.weddingDate,
      timeline,
      progress: calculateWeddingProgress(coupleProfile)
    });
  } catch (error) {
    console.error('Get wedding timeline error:', error);
    res.status(500).json({ error: 'Failed to fetch wedding timeline' });
  }
};

// Helper function to calculate wedding planning progress
function calculateWeddingProgress(coupleProfile) {
  const tasks = [
    { name: 'Set Wedding Date', completed: !!coupleProfile.weddingDate },
    { name: 'Set Budget', completed: !!coupleProfile.budget },
    { name: 'Guest Count', completed: !!coupleProfile.guestCount },
    { name: 'Choose Theme', completed: !!coupleProfile.theme },
    { name: 'Book Venue', completed: coupleProfile.bookings?.some(b => b.venue && b.status === 'confirmed') },
    { name: 'Book Photographer', completed: coupleProfile.bookings?.some(b => b.vendor?.category === 'PHOTOGRAPHER' && b.status === 'confirmed') },
    { name: 'Book Caterer', completed: coupleProfile.bookings?.some(b => b.vendor?.category === 'CATERER' && b.status === 'confirmed') },
    { name: 'Create Registry', completed: !!coupleProfile.weddingRegistry }
  ];

  const completedTasks = tasks.filter(task => task.completed).length;
  const progressPercentage = Math.round((completedTasks / tasks.length) * 100);

  return {
    tasks,
    completedTasks,
    totalTasks: tasks.length,
    progressPercentage
  };
}

// Helper function to generate wedding timeline
function generateWeddingTimeline(weddingDate, bookings = []) {
  if (!weddingDate) {
    return { message: 'Set your wedding date to see your timeline!' };
  }

  const wedding = new Date(weddingDate);
  const now = new Date();
  const timeUntilWedding = Math.ceil((wedding - now) / (1000 * 60 * 60 * 24));

  const timeline = [
    {
      phase: '12+ months before',
      tasks: ['Set date and budget', 'Create guest list', 'Book venue', 'Hire photographer'],
      completed: bookings.filter(b => b.venue || (b.vendor && b.vendor.category === 'PHOTOGRAPHER')).length
    },
    {
      phase: '9-12 months before',
      tasks: ['Send save-the-dates', 'Book caterer', 'Choose wedding party', 'Order invitations'],
      completed: bookings.filter(b => b.vendor && b.vendor.category === 'CATERER').length
    },
    {
      phase: '6-9 months before',
      tasks: ['Book band/DJ', 'Choose flowers', 'Plan honeymoon', 'Register for gifts'],
      completed: bookings.filter(b => b.vendor && ['BAND_DJ', 'FLORIST'].includes(b.vendor.category)).length
    },
    {
      phase: '3-6 months before',
      tasks: ['Send invitations', 'Order cake', 'Book makeup artist', 'Final venue walkthrough'],
      completed: bookings.filter(b => b.vendor && ['CAKE_DESSERT', 'MAKEUP_BEAUTY'].includes(b.vendor.category)).length
    },
    {
      phase: '1-3 months before',
      tasks: ['Final headcount', 'Confirm all vendors', 'Wedding rehearsal', 'Get marriage license'],
      completed: bookings.filter(b => b.status === 'confirmed').length
    }
  ];

  return {
    daysUntilWedding: timeUntilWedding,
    timeline,
    currentPhase: getCurrentPhase(timeUntilWedding)
  };
}

function getCurrentPhase(daysUntilWedding) {
  if (daysUntilWedding > 365) return '12+ months before';
  if (daysUntilWedding > 270) return '9-12 months before';
  if (daysUntilWedding > 180) return '6-9 months before';
  if (daysUntilWedding > 90) return '3-6 months before';
  if (daysUntilWedding > 0) return '1-3 months before';
  return 'Wedding time!';
}

export {
  getDashboard,
  updateProfile,
  getFavorites,
  getBookings,
  getWeddingTimeline
};