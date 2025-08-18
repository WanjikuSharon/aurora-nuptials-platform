import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

// Get couple's wedding registry
const getRegistry = async (req, res) => {
  try {
    if (req.user.role !== 'COUPLE') {
      return res.status(403).json({ error: 'Only couples can access registry' });
    }

    const coupleProfile = await prisma.coupleProfile.findUnique({
      where: { userId: req.user.userId }
    });

    if (!coupleProfile) {
      return res.status(404).json({ error: 'Couple profile not found' });
    }

    let registry = await prisma.weddingRegistry.findUnique({
      where: { coupleProfileId: coupleProfile.id },
      include: {
        registryItems: {
          orderBy: { createdAt: 'desc' }
        },
        coupleProfile: {
          include: {
            user: {
              select: { name: true }
            }
          }
        }
      }
    });

    // Create registry if it doesn't exist
    if (!registry) {
      registry = await prisma.weddingRegistry.create({
        data: {
          coupleProfileId: coupleProfile.id
        },
        include: {
          registryItems: true,
          coupleProfile: {
            include: {
              user: {
                select: { name: true }
              }
            }
          }
        }
      });
    }

    // Calculate registry statistics
    const stats = {
      totalItems: registry.registryItems.length,
      totalValue: registry.registryItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      purchasedItems: registry.registryItems.filter(item => item.purchased).length,
      remainingItems: registry.registryItems.filter(item => !item.purchased).length,
      completionPercentage: registry.registryItems.length > 0 
        ? Math.round((registry.registryItems.filter(item => item.purchased).length / registry.registryItems.length) * 100)
        : 0
    };

    res.json({
      registry,
      stats
    });
  } catch (error) {
    console.error('Get registry error:', error);
    res.status(500).json({ error: 'Failed to fetch registry' });
  }
};

// Add item to registry
const addRegistryItem = async (req, res) => {
  try {
    if (req.user.role !== 'COUPLE') {
      return res.status(403).json({ error: 'Only couples can add registry items' });
    }

    const {
      name,
      description,
      price,
      quantity = 1,
      category,
      brand,
      url,
      image,
      priority = 'MEDIUM'
    } = req.body;

    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const coupleProfile = await prisma.coupleProfile.findUnique({
      where: { userId: req.user.userId }
    });

    if (!coupleProfile) {
      return res.status(404).json({ error: 'Couple profile not found' });
    }

    // Get or create registry
    let registry = await prisma.weddingRegistry.findUnique({
      where: { coupleProfileId: coupleProfile.id }
    });

    if (!registry) {
      registry = await prisma.weddingRegistry.create({
        data: {
          coupleProfileId: coupleProfile.id
        }
      });
    }

    const registryItem = await prisma.registryItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        category,
        brand,
        url,
        image,
        priority,
        registryId: registry.id
      }
    });

    res.status(201).json(registryItem);
  } catch (error) {
    console.error('Add registry item error:', error);
    res.status(500).json({ error: 'Failed to add registry item' });
  }
};

// Update registry item
const updateRegistryItem = async (req, res) => {
  try {
    if (req.user.role !== 'COUPLE') {
      return res.status(403).json({ error: 'Only couples can update registry items' });
    }

    const { id } = req.params;
    const {
      name,
      description,
      price,
      quantity,
      category,
      brand,
      url,
      image,
      priority,
      purchased,
      purchasedBy,
      purchaseDate
    } = req.body;

    const coupleProfile = await prisma.coupleProfile.findUnique({
      where: { userId: req.user.userId }
    });

    if (!coupleProfile) {
      return res.status(404).json({ error: 'Couple profile not found' });
    }

    // Check if item belongs to this couple
    const existingItem = await prisma.registryItem.findFirst({
      where: {
        id: parseInt(id),
        registry: {
          coupleProfileId: coupleProfile.id
        }
      }
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Registry item not found' });
    }

    const updatedItem = await prisma.registryItem.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        quantity: quantity ? parseInt(quantity) : undefined,
        category,
        brand,
        url,
        image,
        priority,
        purchased: purchased !== undefined ? Boolean(purchased) : undefined,
        purchasedBy,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined
      }
    });

    res.json(updatedItem);
  } catch (error) {
    console.error('Update registry item error:', error);
    res.status(500).json({ error: 'Failed to update registry item' });
  }
};

// Delete registry item
const deleteRegistryItem = async (req, res) => {
  try {
    if (req.user.role !== 'COUPLE') {
      return res.status(403).json({ error: 'Only couples can delete registry items' });
    }

    const { id } = req.params;

    const coupleProfile = await prisma.coupleProfile.findUnique({
      where: { userId: req.user.userId }
    });

    if (!coupleProfile) {
      return res.status(404).json({ error: 'Couple profile not found' });
    }

    // Check if item belongs to this couple
    const existingItem = await prisma.registryItem.findFirst({
      where: {
        id: parseInt(id),
        registry: {
          coupleProfileId: coupleProfile.id
        }
      }
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Registry item not found' });
    }

    await prisma.registryItem.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Registry item deleted successfully' });
  } catch (error) {
    console.error('Delete registry item error:', error);
    res.status(500).json({ error: 'Failed to delete registry item' });
  }
};

// Get public registry (for guests to view)
const getPublicRegistry = async (req, res) => {
  try {
    const { coupleId } = req.params;

    const coupleProfile = await prisma.coupleProfile.findUnique({
      where: { id: parseInt(coupleId) },
      include: {
        user: {
          select: { name: true }
        }
      }
    });

    if (!coupleProfile) {
      return res.status(404).json({ error: 'Couple not found' });
    }

    const registry = await prisma.weddingRegistry.findUnique({
      where: { coupleProfileId: coupleProfile.id },
      include: {
        registryItems: {
          where: { purchased: false }, // Only show unpurchased items
          orderBy: [
            { priority: 'desc' },
            { createdAt: 'asc' }
          ]
        }
      }
    });

    if (!registry) {
      return res.status(404).json({ error: 'Registry not found' });
    }

    // Group items by category
    const itemsByCategory = registry.registryItems.reduce((acc, item) => {
      const category = item.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});

    res.json({
      coupleName: coupleProfile.user.name,
      weddingDate: coupleProfile.weddingDate,
      registry: {
        id: registry.id,
        totalItems: registry.registryItems.length,
        itemsByCategory
      }
    });
  } catch (error) {
    console.error('Get public registry error:', error);
    res.status(500).json({ error: 'Failed to fetch registry' });
  }
};

// Mark item as purchased (for guests)
const purchaseRegistryItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { purchasedBy, message } = req.body;

    if (!purchasedBy) {
      return res.status(400).json({ error: 'Purchaser name is required' });
    }

    const item = await prisma.registryItem.findUnique({
      where: { id: parseInt(itemId) }
    });

    if (!item) {
      return res.status(404).json({ error: 'Registry item not found' });
    }

    if (item.purchased) {
      return res.status(400).json({ error: 'Item already purchased' });
    }

    const updatedItem = await prisma.registryItem.update({
      where: { id: parseInt(itemId) },
      data: {
        purchased: true,
        purchasedBy,
        purchaseDate: new Date(),
        purchaseMessage: message
      }
    });

    res.json({
      message: 'Item marked as purchased',
      item: updatedItem
    });
  } catch (error) {
    console.error('Purchase registry item error:', error);
    res.status(500).json({ error: 'Failed to purchase item' });
  }
};

// Get registry categories
const getRegistryCategories = async (req, res) => {
  try {
    const categories = [
      'Kitchen & Dining',
      'Bedroom & Bath',
      'Home Decor',
      'Appliances',
      'Outdoor & Garden',
      'Electronics',
      'Furniture',
      'Cookware',
      'Linens & Bedding',
      'China & Serveware',
      'Glassware & Barware',
      'Experience & Travel',
      'Cash Fund',
      'Other'
    ];

    res.json(categories);
  } catch (error) {
    console.error('Get registry categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Get registry statistics
const getRegistryStats = async (req, res) => {
  try {
    if (req.user.role !== 'COUPLE') {
      return res.status(403).json({ error: 'Only couples can view registry stats' });
    }

    const coupleProfile = await prisma.coupleProfile.findUnique({
      where: { userId: req.user.userId }
    });

    if (!coupleProfile) {
      return res.status(404).json({ error: 'Couple profile not found' });
    }

    const registry = await prisma.weddingRegistry.findUnique({
      where: { coupleProfileId: coupleProfile.id },
      include: {
        registryItems: true
      }
    });

    if (!registry) {
      return res.json({
        totalItems: 0,
        totalValue: 0,
        purchasedItems: 0,
        remainingItems: 0,
        completionPercentage: 0,
        categoryBreakdown: {},
        recentPurchases: []
      });
    }

    // Calculate statistics
    const stats = {
      totalItems: registry.registryItems.length,
      totalValue: registry.registryItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      purchasedItems: registry.registryItems.filter(item => item.purchased).length,
      remainingItems: registry.registryItems.filter(item => !item.purchased).length,
      completionPercentage: registry.registryItems.length > 0 
        ? Math.round((registry.registryItems.filter(item => item.purchased).length / registry.registryItems.length) * 100)
        : 0
    };

    // Category breakdown
    const categoryBreakdown = registry.registryItems.reduce((acc, item) => {
      const category = item.category || 'Other';
      if (!acc[category]) {
        acc[category] = { total: 0, purchased: 0, value: 0 };
      }
      acc[category].total++;
      acc[category].value += item.price * item.quantity;
      if (item.purchased) {
        acc[category].purchased++;
      }
      return acc;
    }, {});

    // Recent purchases
    const recentPurchases = registry.registryItems
      .filter(item => item.purchased)
      .sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))
      .slice(0, 5);

    res.json({
      ...stats,
      categoryBreakdown,
      recentPurchases
    });
  } catch (error) {
    console.error('Get registry stats error:', error);
    res.status(500).json({ error: 'Failed to fetch registry statistics' });
  }
};

export {
  getRegistry,
  addRegistryItem,
  updateRegistryItem,
  deleteRegistryItem,
  getPublicRegistry,
  purchaseRegistryItem,
  getRegistryCategories,
  getRegistryStats
};