import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

// Get all vendors with filtering
const getVendors = async (req, res) => {
  try {
    const {
      category,
      city,
      state,
      verified,
      priceRange,
      search,
      page = 1,
      limit = 12
    } = req.query;

    const where = {};

    // Filter by category
    if (category) {
      where.category = category;
    }

    // Filter by location (from user's venues)
    if (city || state) {
      where.venues = {
        some: {
          ...(city && { city: { contains: city, mode: 'insensitive' } }),
          ...(state && { state: { contains: state, mode: 'insensitive' } })
        }
      };
    }

    // Filter by verification status
    if (verified !== undefined) {
      where.verified = verified === 'true';
    }

    // Filter by price range
    if (priceRange) {
      where.priceRange = { contains: priceRange, mode: 'insensitive' };
    }

    // Search functionality
    if (search) {
      where.OR = [
        { businessName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get vendors with pagination
    const [vendors, totalCount] = await Promise.all([
      prisma.vendorProfile.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true
            }
          },
          venues: {
            select: {
              id: true,
              name: true,
              city: true,
              state: true,
              venueType: true,
              capacity: true,
              images: true
            }
          },
          reviews: {
            select: {
              id: true,
              rating: true,
              comment: true,
              reviewerName: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' },
            take: 5
          },
          _count: {
            select: {
              venues: true,
              reviews: true,
              favorites: true
            }
          }
        },
        orderBy: [
          { verified: 'desc' }, // Verified vendors first
          { createdAt: 'desc' }
        ],
        skip,
        take: parseInt(limit)
      }),
      prisma.vendorProfile.count({ where })
    ]);

    // Calculate average rating for each vendor
    const vendorsWithRatings = vendors.map(vendor => ({
      ...vendor,
      averageRating: vendor.reviews.length > 0
        ? vendor.reviews.reduce((sum, review) => sum + review.rating, 0) / vendor.reviews.length
        : null
    }));

    res.json({
      vendors: vendorsWithRatings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNext: skip + parseInt(limit) < totalCount,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
};

// Get single vendor by ID
const getVendorById = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendorProfile.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
          }
        },
        venues: {
          include: {
            favorites: { select: { id: true } },
            bookings: { 
              select: { id: true, status: true },
              where: { status: { not: 'cancelled' } }
            }
          }
        },
        reviews: {
          orderBy: { createdAt: 'desc' }
        },
        favorites: {
          include: {
            coupleProfile: {
              include: {
                user: { select: { name: true } }
              }
            }
          }
        },
        bookings: {
          include: {
            coupleProfile: {
              include: {
                user: { select: { name: true, email: true } }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    // Calculate average rating
    const averageRating = vendor.reviews.length > 0
      ? vendor.reviews.reduce((sum, review) => sum + review.rating, 0) / vendor.reviews.length
      : null;

    res.json({
      ...vendor,
      averageRating,
      stats: {
        totalVenues: vendor.venues.length,
        totalReviews: vendor.reviews.length,
        totalFavorites: vendor.favorites.length,
        totalBookings: vendor.bookings.length
      }
    });
  } catch (error) {
    console.error('Get vendor by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch vendor' });
  }
};

// Update vendor profile (Owner only)
const updateVendorProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      businessName,
      category,
      description,
      priceRange
    } = req.body;

    // Check if vendor profile exists
    const existingProfile = await prisma.vendorProfile.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingProfile) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    // Check permissions (profile owner or admin)
    if (req.user.role !== 'ADMIN' && existingProfile.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this profile' });
    }

    // Validate category
    const allowedCategories = [
      'VENUE', 'PHOTOGRAPHER', 'VIDEOGRAPHER', 'CATERER', 'FLORIST',
      'MAKEUP_BEAUTY', 'WEDDING_PLANNER', 'BAND_DJ', 'CAKE_DESSERT',
      'BAR_BEVERAGE', 'OFFICIANT'
    ];

    if (category && !allowedCategories.includes(category)) {
      return res.status(400).json({
        error: `Invalid category. Must be one of: ${allowedCategories.join(', ')}`
      });
    }

    const updatedProfile = await prisma.vendorProfile.update({
      where: { id: parseInt(id) },
      data: {
        businessName,
        category,
        description,
        priceRange
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        venues: true,
        reviews: true
      }
    });

    res.json(updatedProfile);
  } catch (error) {
    console.error('Update vendor profile error:', error);
    res.status(500).json({ error: 'Failed to update vendor profile' });
  }
};

// Get vendor's own profile (for dashboard)
const getMyProfile = async (req, res) => {
  try {
    if (req.user.role !== 'VENDOR') {
      return res.status(403).json({ error: 'Only vendors can access this endpoint' });
    }

    const vendorProfile = await prisma.vendorProfile.findUnique({
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
        venues: {
          include: {
            favorites: { select: { id: true } },
            bookings: {
              select: {
                id: true,
                eventDate: true,
                status: true,
                coupleProfile: {
                  include: {
                    user: { select: { name: true, email: true } }
                  }
                }
              },
              orderBy: { eventDate: 'asc' }
            }
          }
        },
        reviews: {
          orderBy: { createdAt: 'desc' }
        },
        favorites: {
          include: {
            coupleProfile: {
              include: {
                user: { select: { name: true } }
              }
            }
          }
        },
        bookings: {
          include: {
            coupleProfile: {
              include: {
                user: { select: { name: true, email: true } }
              }
            }
          },
          orderBy: { eventDate: 'asc' }
        }
      }
    });

    if (!vendorProfile) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    // Calculate statistics
    const stats = {
      totalVenues: vendorProfile.venues.length,
      totalReviews: vendorProfile.reviews.length,
      averageRating: vendorProfile.reviews.length > 0
        ? vendorProfile.reviews.reduce((sum, review) => sum + review.rating, 0) / vendorProfile.reviews.length
        : null,
      totalFavorites: vendorProfile.favorites.length,
      totalBookings: vendorProfile.bookings.length,
      pendingBookings: vendorProfile.bookings.filter(b => b.status === 'pending').length,
      confirmedBookings: vendorProfile.bookings.filter(b => b.status === 'confirmed').length
    };

    res.json({
      ...vendorProfile,
      stats
    });
  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Get vendor categories for filters
const getVendorCategories = async (req, res) => {
  try {
    const categories = [
      'VENUE',
      'PHOTOGRAPHER',
      'VIDEOGRAPHER',
      'CATERER',
      'FLORIST',
      'MAKEUP_BEAUTY',
      'WEDDING_PLANNER',
      'BAND_DJ',
      'CAKE_DESSERT',
      'BAR_BEVERAGE',
      'OFFICIANT'
    ];

    res.json(categories);
  } catch (error) {
    console.error('Get vendor categories error:', error);
    res.status(500).json({ error: 'Failed to fetch vendor categories' });
  }
};

// Add vendor to favorites (Couple only)
const addVendorToFavorites = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'COUPLE') {
      return res.status(403).json({ error: 'Only couples can add vendors to favorites' });
    }

    // Get couple profile
    const coupleProfile = await prisma.coupleProfile.findUnique({
      where: { userId: req.user.userId }
    });

    if (!coupleProfile) {
      return res.status(400).json({ error: 'Couple profile not found' });
    }

    // Check if vendor exists
    const vendor = await prisma.vendorProfile.findUnique({
      where: { id: parseInt(id) }
    });

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    // Check if already in favorites
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        coupleProfileId: coupleProfile.id,
        vendorId: parseInt(id)
      }
    });

    if (existingFavorite) {
      return res.status(400).json({ error: 'Vendor already in favorites' });
    }

    const favorite = await prisma.favorite.create({
      data: {
        coupleProfileId: coupleProfile.id,
        vendorId: parseInt(id)
      },
      include: {
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
    });

    res.status(201).json(favorite);
  } catch (error) {
    console.error('Add vendor to favorites error:', error);
    res.status(500).json({ error: 'Failed to add vendor to favorites' });
  }
};

// Remove vendor from favorites
const removeVendorFromFavorites = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'COUPLE') {
      return res.status(403).json({ error: 'Only couples can remove vendors from favorites' });
    }

    // Get couple profile
    const coupleProfile = await prisma.coupleProfile.findUnique({
      where: { userId: req.user.userId }
    });

    if (!coupleProfile) {
      return res.status(400).json({ error: 'Couple profile not found' });
    }

    const favorite = await prisma.favorite.findFirst({
      where: {
        coupleProfileId: coupleProfile.id,
        vendorId: parseInt(id)
      }
    });

    if (!favorite) {
      return res.status(404).json({ error: 'Vendor not in favorites' });
    }

    await prisma.favorite.delete({
      where: { id: favorite.id }
    });

    res.json({ message: 'Vendor removed from favorites' });
  } catch (error) {
    console.error('Remove vendor from favorites error:', error);
    res.status(500).json({ error: 'Failed to remove vendor from favorites' });
  }
};

// Verify vendor (Admin only)
const verifyVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admins can verify vendors' });
    }

    const vendor = await prisma.vendorProfile.findUnique({
      where: { id: parseInt(id) }
    });

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    const updatedVendor = await prisma.vendorProfile.update({
      where: { id: parseInt(id) },
      data: { verified: Boolean(verified) },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      message: `Vendor ${verified ? 'verified' : 'unverified'} successfully`,
      vendor: updatedVendor
    });
  } catch (error) {
    console.error('Verify vendor error:', error);
    res.status(500).json({ error: 'Failed to verify vendor' });
  }
};

export {
  getVendors,
  getVendorById,
  updateVendorProfile,
  getMyProfile,
  getVendorCategories,
  addVendorToFavorites,
  removeVendorFromFavorites,
  verifyVendor
};