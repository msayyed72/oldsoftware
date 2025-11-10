# Logistics Management System

A modern full-stack logistics and shipment management application rebuilt from an Angular/PHP legacy system.

## 📋 Project Overview

**Purpose:** Internal testing and development environment for a logistics management system handling customer bookings, warehouse operations, customs clearance, and delivery tracking.

**Stack:**
- **Frontend:** Next.js 16 (React 19) + TailwindCSS + Shadcn/UI
- **Backend:** NestJS (Node.js 22, TypeScript)
- **Database:** PostgreSQL (local via Prisma ORM)
- **Cache:** Redis (local)
- **Background Jobs:** BullMQ

## 🏗️ Architecture

### Monorepo Structure
```
/
├── frontend/          # Next.js application (Port 5000)
├── backend/           # NestJS API server (Port 3000)
├── .gitignore
└── replit.md
```

### Five Core Modules

1. **Landing Page** - Public homepage with system overview and login
2. **Booking** - Customer booking creation and management
3. **Operations** - Dispatch, receiving, and manifest management
4. **Customs** - Customs clearance and FreeAgent invoice integration
5. **Delivery** - Shipment tracking and delivery status

## 🚀 Getting Started

### Environment Setup

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**Backend (.env):**
```
DATABASE_URL="postgresql://runner:zone@localhost:5432/logistics?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
NODE_ENV=development
```

### Running the Application

Both frontend and backend start automatically via Replit workflows:
- **Frontend:** http://localhost:5000 (Next.js dev server)
- **Backend API:** http://localhost:3000/api (NestJS server)

### Test Credentials

```
Admin: admin@logistics.com / admin123
Staff: staff@logistics.com / staff123
```

## 📊 Database Schema

### Models
- **User** - Authentication and role-based access (ADMIN, STAFF)
- **Booking** - Customer booking records with shipment details
- **Shipment** - Individual package tracking and delivery
- **Manifest** - Dispatch/receiving/forward/return manifests
- **ManifestItem** - Links shipments to manifests

### Sample Data
The database is pre-seeded with:
- 2 users (admin + staff)
- 2 bookings
- 4 shipments
- 2 manifests with linked items

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Bookings
- `GET /api/bookings` - List all bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

### Shipments
- `GET /api/shipments` - List all shipments
- `GET /api/shipments/statistics` - Get shipment stats
- `POST /api/shipments` - Create shipment
- `GET /api/shipments/:id` - Get shipment details
- `PUT /api/shipments/:id` - Update shipment
- `DELETE /api/shipments/:id` - Delete shipment

### Manifests
- `GET /api/manifests` - List all manifests
- `POST /api/manifests` - Create manifest
- `GET /api/manifests/:id` - Get manifest details
- `PUT /api/manifests/:id` - Update manifest
- `POST /api/manifests/:id/shipments` - Add shipment to manifest
- `DELETE /api/manifests/:id/shipments/:shipmentId` - Remove shipment
- `DELETE /api/manifests/:id` - Delete manifest

## 🔐 Security

- JWT-based authentication with 24h token expiry
- Role-based access control (ADMIN, STAFF)
- Password hashing with bcrypt
- CORS enabled for local development

## 📦 Key Features

### Booking Module
- Create customer bookings with full details
- Service type selection (Air Cargo, Ground, Express)
- Origin/destination routing
- Weight and value tracking
- Status management (Pending, Confirmed, In Progress, Completed, Cancelled)

### Operations Module
- Dispatch manifest creation
- Receiving manifest management
- Forwarding to branch locations
- Vehicle and driver assignment
- Shipment consolidation

### Customs Module
- Customs manifest generation
- FreeAgent invoice integration (placeholder)
- Duty and handling fee management
- Clearance documentation

### Delivery Module
- Real-time tracking by tracking number
- Shipment status updates
- Sender and receiver details
- Current location tracking
- Status-based filtering

## 🛠️ Development Notes

### Local-Only Setup
- No remote database connections
- No AWS or production services
- All data is local and for testing only
- Redis errors in logs are expected (BullMQ feature, non-critical)

### Background Jobs
- BullMQ queue configured for report generation
- Redis connection errors can be ignored for basic functionality
- Job processing demonstrates async workflow patterns

### Code Quality
- TypeScript throughout
- Modular, service-based architecture
- Clean separation of concerns
- Ready for future AWS deployment

## 📝 Recent Changes

**November 10, 2025:**
- Initial project setup completed
- Full-stack monorepo structure created
- Five core modules implemented
- Database seeded with sample data
- Authentication system configured
- Workflows set up for automatic startup

## 🎯 Future Enhancements

- Image upload for shipment documentation
- Aadhaar verification integration
- Email notification system
- PDF report generation
- Advanced search and filtering
- Export functionality (Excel, PDF)
- Real-time notifications
- Mobile responsiveness improvements
