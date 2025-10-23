# 💍 Aurora Nuptials Platform

A comprehensive wedding planning platform that connects couples with trusted vendors, venues, and planning tools to create their perfect wedding day.

## ✨ Features

### 👰 For Couples

- **Personalized Dashboard** - Track wedding progress and manage planning timeline
- **Venue Discovery** - Browse and book stunning wedding venues
- **Vendor Marketplace** - Connect with verified photographers, caterers, florists, and more
- **Wedding Registry** - Create and manage gift registries for guests
- **Booking Management** - Handle all wedding service bookings in one place
- **Progress Tracking** - Visual progress indicators for wedding planning milestones

### 🏢 For Vendors

- **Vendor Portal** - Manage business profile and showcase services
- **Booking Management** - Handle client bookings and availability
- **Portfolio Showcase** - Display work samples and client testimonials
- **Revenue Tracking** - Monitor business performance and earnings

### 🏛️ For Venue Owners

- **Venue Management** - List and manage wedding venues
- **Availability Calendar** - Real-time booking calendar management
- **Photo Galleries** - Showcase venue spaces and amenities
- **Pricing Management** - Flexible pricing and package options

### 🛡️ For Administrators

- **User Management** - Oversee platform users and permissions
- **Content Moderation** - Review and approve venue/vendor listings
- **Analytics Dashboard** - Platform usage statistics and insights
- **System Monitoring** - Platform health and performance metrics

## 🛠️ Technology Stack

### Frontend

- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **RTK Query** for API calls
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

### Backend

- **Node.js** with Express.js
- **Prisma ORM** for database management
- **PostgreSQL** database
- **JWT Authentication** with role-based access control
- **bcryptjs** for password hashing
- **CORS** enabled for cross-origin requests

### Design System

- **Navy (#0A192F)** - Primary brand color
- **Gold (#D4AF37)** - Secondary accent color
- **Champagne (#F7E7CE)** - Tertiary color
- **Ivory (#FAF9F6)** - Background color
- **Glass morphism** effects with backdrop-blur
- **Responsive design** for all devices

## 📁 Project Structure

```
aurora-nuptials-platform/
├── Backend/
│   ├── server.js                 # Main server file
│   ├── controllers/             # API controllers
│   │   ├── authController.js    # Authentication logic
│   │   ├── bookingController.js # Booking management
│   │   ├── coupleController.js  # Couple-specific features
│   │   ├── registryController.js# Wedding registry
│   │   ├── vendorController.js  # Vendor management
│   │   └── venueController.js   # Venue management
│   ├── middleware/              # Custom middleware
│   │   ├── auth.js              # JWT authentication
│   │   └── AuthMiddleware.js    # Role-based access
│   ├── models/                  # Database models (Prisma)
│   └── routes/                  # API routes
│       ├── bookingRoutes.js
│       ├── coupleRoutes.js
│       ├── registryRoute.js
│       ├── userRoutes.js
│       ├── vendorRoutes.js
│       └── venueRoutes.js
├── Frontend/
│   ├── public/                  # Static assets
│   └── src/
│       ├── components/          # Reusable components
│       │   ├── auth/           # Authentication components
│       │   ├── layout/         # Layout components (Header, Footer)
│       │   └── ui/             # UI components (Toast, LoadingSkeleton)
│       ├── pages/              # Page components
│       │   ├── auth/           # Login, Register pages
│       │   └── couple/         # Couple dashboard
│       ├── store/              # Redux store configuration
│       │   ├── api/            # RTK Query API slices
│       │   └── slices/         # Redux slices
│       ├── types/              # TypeScript type definitions
│       └── main.tsx            # App entry point
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
└── generated/                  # Prisma generated files
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/WanjikuSharon/aurora-nuptials-platform.git
cd aurora-nuptials-platform
```

2. **Install backend dependencies**

```bash
cd Backend
npm install
```

3. **Install frontend dependencies**

```bash
cd ../Frontend
npm install
```

4. **Set up environment variables**
   Create a `.env` file in the Backend directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/aurora_nuptials"
JWT_SECRET="your-jwt-secret-key"
PORT=5000
```

5. **Set up the database**

```bash
cd ../Backend
npx prisma migrate dev
npx prisma generate
```

6. **Start the development servers**

Backend:

```bash
cd Backend
npm run dev
```

Frontend (in a new terminal):

```bash
cd Frontend
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🎨 Design Features

- **Luxury Glass Navbar** - Modern backdrop-blur navigation with gold accents
- **Animated Statistics** - Smooth counting animations with intersection observer
- **Carousel Hero Section** - Auto-advancing image carousel with premium wedding photos
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Accessible UI** - WCAG compliant with proper contrast ratios and keyboard navigation

## 🔐 Authentication & Authorization

- **JWT-based authentication** with secure token storage
- **Role-based access control** (Couple, Vendor, Admin)
- **Protected routes** with role-specific redirects
- **Secure password hashing** using bcryptjs
- **Session management** with token refresh capabilities

## 📊 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Venues

- `GET /api/venues` - Get all venues
- `POST /api/venues` - Create new venue (Vendor only)
- `GET /api/venues/:id` - Get venue details
- `PUT /api/venues/:id` - Update venue (Owner only)

### Bookings

- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

## 🧪 Testing

```bash
# Run backend tests
cd Backend
npm test

# Run frontend tests
cd Frontend
npm test
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
cd Frontend
npm run build
```

### Backend (Heroku/Railway)

```bash
cd Backend
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Sharon Wanjiku** - _Initial work_ - [WanjikuSharon](https://github.com/WanjikuSharon)

## 🙏 Acknowledgments

- Thanks to all couples who provided feedback on the platform
- Vendor partners for their collaboration and support
- Open source community for the amazing tools and libraries

## 📞 Support

For support, email auroranuptials@gmail.com or create an issue in this repository.

---

**Made with ❤️ for couples planning their perfect wedding day**
