# Joyful Crochets - Premium Handmade Crochet E-Commerce Platform

A production-ready full-stack e-commerce website for a premium handmade crochet products brand. Built with React, TypeScript, Node.js, Express, and MongoDB.

## Features

### Frontend
- **Premium Design** - Luxury aesthetic with warm neutral palette, elegant typography, and refined animations
- **20+ Pages** - Home, Shop, Product Details, About, Contact, Gallery, Cart, Checkout, and more
- **Admin Dashboard** - Complete management system with analytics, product/order/customer management
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Dark Mode** - Toggle between light and dark themes
- **Smooth Animations** - Framer Motion powered transitions and micro-interactions
- **Advanced Shop** - Filters, sorting, pagination, search, and wishlist
- **Real-time Cart** - Persistent shopping cart with quantity management
- **Authentication** - Login, register, forgot password, JWT refresh tokens
- **Form Validation** - React Hook Form with Zod schemas

### Backend
- **RESTful API** - Express.js with clean architecture
- **MongoDB** - Mongoose ODM with 14+ data models
- **JWT Authentication** - Access & refresh token authentication
- **Role-based Access** - Customer and admin roles
- **Image Uploads** - Cloudinary integration
- **Security** - Helmet, CORS, rate limiting, input sanitization
- **Seed Data** - 20+ products, categories, testimonials, FAQs

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Zustand, TanStack Query |
| Backend | Node.js, Express.js, MongoDB, Mongoose, JWT, Cloudinary |
| UI | Radix UI (shadcn/ui), Lucide Icons, Embla Carousel |
| Forms | React Hook Form, Zod Validation |
| Build | Vite, PostCSS, Autoprefixer |
| DevOps | Docker, Docker Compose, Nginx |

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/joyful-crotchets.git
cd joyful-crotchets

# Install all dependencies
npm run install:all

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Seed the database
npm run seed

# Start development servers
npm run dev
```

### Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/joyful-crotchets
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Client
VITE_API_URL=http://localhost:5000/api
```

### Docker Deployment

```bash
# Build and run all services
docker-compose up -d

# Seed the database (first time only)
docker-compose exec server node src/seeds/seed.js

# View logs
docker-compose logs -f
```

## Project Structure

```
joyful-crotchets/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   ├── layout/       # Layout components
│   │   │   ├── home/         # Home page sections
│   │   │   ├── shop/         # Shop components
│   │   │   ├── product/      # Product components
│   │   │   ├── cart/         # Cart components
│   │   │   ├── auth/         # Auth components
│   │   │   ├── admin/        # Admin components
│   │   │   └── common/       # Shared components
│   │   ├── pages/            # Route pages
│   │   │   └── admin/        # Admin pages
│   │   ├── hooks/            # Custom React hooks
│   │   ├── stores/           # Zustand state stores
│   │   ├── services/         # API services
│   │   ├── context/          # React context
│   │   ├── lib/              # Utilities
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Helper functions
│   ├── public/               # Static assets
│   └── index.html
├── server/                    # Node.js backend
│   ├── src/
│   │   ├── config/           # DB, Cloudinary config
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/        # Auth, error, upload
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API routes
│   │   ├── seeds/            # Database seeder
│   │   └── utils/            # Server utilities
│   └── uploads/              # Temp uploads
├── docker-compose.yml
├── package.json
└── README.md
```

## API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| POST | /api/auth/logout | Logout user |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/profile | Update profile |
| PUT | /api/auth/password | Update password |
| POST | /api/auth/forgot-password | Request password reset |
| POST | /api/auth/reset-password/:token | Reset password |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get all products (paginated, filterable) |
| GET | /api/products/:id | Get single product |
| GET | /api/products/featured | Get featured products |
| GET | /api/products/best-sellers | Get best sellers |
| GET | /api/products/new-arrivals | Get new arrivals |
| POST | /api/products | Create product (admin) |
| PUT | /api/products/:id | Update product (admin) |
| DELETE | /api/products/:id | Delete product (admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/orders | Get all orders (admin) |
| GET | /api/orders/my-orders | Get user orders |
| GET | /api/orders/:id | Get single order |
| POST | /api/orders | Create order |
| PUT | /api/orders/:id/status | Update order status (admin) |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/categories | Get all categories |
| POST | /api/categories | Create category (admin) |
| PUT | /api/categories/:id | Update category (admin) |
| DELETE | /api/categories/:id | Delete category (admin) |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/reviews/product/:productId | Get product reviews |
| POST | /api/reviews | Create review |
| DELETE | /api/reviews/:id | Delete review |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cart | Get cart |
| POST | /api/cart/items | Add to cart |
| PUT | /api/cart/items/:itemId | Update quantity |
| DELETE | /api/cart/items/:itemId | Remove item |
| POST | /api/cart/coupon | Apply coupon |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | /api/wishlist | Manage wishlist |
| GET/POST | /api/testimonials | Manage testimonials |
| GET/POST | /api/faqs | Manage FAQs |
| POST | /api/subscribers/subscribe | Subscribe to newsletter |
| POST | /api/custom-orders | Submit custom order |
| GET/POST | /api/coupons | Manage coupons (admin) |
| GET/PUT | /api/settings | Site settings |

## Default Credentials

### Admin Account
- Email: admin@joyfulcrotchets.com
- Password: Admin123!

### Customer Account
- Email: jessica@example.com
- Password: Customer123!

## License

MIT License - see LICENSE file for details.