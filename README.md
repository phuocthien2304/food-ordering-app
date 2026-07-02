# Food Ordering Microservices Platform

A comprehensive microservice-based food ordering system built with NestJS, Node.js, MongoDB, RabbitMQ, Docker, and React. This application demonstrates a complete restaurant food delivery platform with separate backend services and modern frontend UI.

## Features

### Customer Features
- User registration and authentication with JWT
- Browse restaurants and menus
- Advanced search and filtering
- Real-time order tracking with ETA calculation
- Support for COD and online payment methods (VNPay/Sepay)
- Order history and ratings

### Restaurant Features
- Restaurant profile management
- Menu management with categories and availability
- Real-time order notifications
- Order status management
- Daily statistics and revenue tracking
- Location-based operations

### Admin Features
- User and restaurant management
- System monitoring and logs
- Payment and delivery statistics
- System configuration

## Architecture

The system uses a **separated microservice architecture** with independent backend and frontend:

\`\`\`
┌──────────────────────────────────────────┐
│     FRONTEND (React + Vite)              │
│     Port 5173 / 3000                     │
└──────────────────┬───────────────────────┘
                   │ (REST API)
       ┌───────────▼────────────┐
       │   API Gateway          │
       │   Port 3000            │
       └───────────┬────────────┘
                   │
    ┌──────────────┼──────────────┬─────────────┐
    │              │              │             │
┌───▼──┐  ┌───────▼──┐  ┌────────▼───┐  ┌────▼─────┐
│User  │  │  Order   │  │ Restaurant │  │ Delivery │
│Svc   │  │  Svc     │  │ Svc        │  │ Svc      │
│3003  │  │  3001    │  │ 3002       │  │ 3004     │
└──────┘  └──────────┘  └────────────┘  └──────────┘
    │
    └───────────┬──────────┐
                │          │
           ┌────▼───┐  ┌───▼─────┐
           │ Payment│  │RabbitMQ │
           │ Svc    │  │ Queue   │
           │ 3005   │  │ 5672    │
           └────────┘  └─────────┘
                │
           ┌────▼──────────┐
           │   MongoDB     │
           │   27017       │
           └───────────────┘
\`\`\`

## Technology Stack

### Backend Services
- **NestJS**: Progressive Node.js framework
- **Node.js 18+**: JavaScript runtime
- **Express.js**: HTTP server framework

### Frontend
- **React 18+**: UI library
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Axios**: HTTP client

### Data & Messaging
- **MongoDB**: NoSQL database for data persistence
- **RabbitMQ**: Message broker for asynchronous communication
- **Mongoose**: MongoDB object modeling

### Authentication & Security
- **JWT**: Token-based authentication
- **bcryptjs**: Password hashing
- **Passport**: Authentication middleware

### Deployment & DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Kubernetes** (optional): Production orchestration

### External Integrations
- **VNPay**: Payment gateway
- **Sepay**: Alternative payment gateway
- **Google Maps API**: Location and distance calculation (Haversine formula)

## Project Structure

\`\`\`
food-ordering-app/
├── backend/                       # Backend Microservices
│   ├── api-gateway/               # Central API Gateway (Port 3000)
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── user-service/              # User Auth (Port 3003)
│   ├── order-service/             # Orders (Port 3001)
│   ├── restaurant-service/        # Restaurants (Port 3002)
│   ├── delivery-service/          # Delivery (Port 3004)
│   ├── payment-service/           # Payments (Port 3005)
│   ├── docker-compose.yml         # Backend orchestration
│   ├── API_DOCUMENTATION.md       # API Reference
│   └── DEPLOYMENT.md              # Backend deployment
│
├── frontend/                      # Frontend Application (Port 5173)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.tsx
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
│
├── docker-compose.yml             # Full-stack orchestration
├── STRUCTURE.md                   # Project structure details
├── .gitignore
└── README.md                      # This file
\`\`\`

## Quick Start

### Option 1: Docker Compose (Recommended)

1. **Clone repository**
   \`\`\`bash
   git clone https://github.com/phuocthien2304/food-ordering-app
   cd food-ordering-app
   \`\`\`

2. **Start all services (Backend + Frontend)**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

3. **Access services**
   - Frontend: http://localhost:5173
   - API Gateway: http://localhost:3000
   - RabbitMQ Management: http://localhost:15672 (guest/guest)
   - MongoDB: mongodb://admin:password@localhost:27017

### Option 2: Backend Only (Docker)

\`\`\`bash
cd backend
docker-compose up -d
\`\`\`

- API Gateway: http://localhost:3000
- RabbitMQ Management: http://localhost:15672

### Option 3: Local Development

**Terminal 1: Start Backend Services**
\`\`\`bash
cd backend
docker-compose up -d
\`\`\`

**Terminal 2: Start Frontend Development Server**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

- Frontend: http://localhost:5173
- API: http://localhost:3000

## API Documentation

Comprehensive API documentation is available in [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)

### Quick Examples

**Register User**
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John"
  }'
\`\`\`

**Create Order**
\`\`\`bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "user_id",
    "restaurantId": "restaurant_id",
    "paymentMethod": "COD",
    "items": [{"name": "Pizza", "price": 12.99, "quantity": 1}]
  }'
\`\`\`

## Key Microservices

| Service | Port | Purpose |
|---------|------|---------|
| API Gateway | 3000 | Central routing point |
| User Service | 3003 | Authentication & user management |
| Order Service | 3001 | Order lifecycle management |
| Restaurant Service | 3002 | Restaurants & menus |
| Delivery Service | 3004 | Delivery tracking & ETA |
| Payment Service | 3005 | Payment processing |
| Frontend | 5173 | React UI |
| MongoDB | 27017 | Database |
| RabbitMQ | 5672 | Message broker |

## Event-Driven Architecture

Services communicate asynchronously via RabbitMQ:

- **order_created**: Order service → Delivery/Payment services
- **payment_confirmed**: Payment service → Order service
- **delivery_started**: Delivery service → Order service
- **delivery_status_changed**: Delivery service → Order service

## Environment Variables

### Backend
Each service has `.env` file. See `backend/` service folders for required variables.

### Frontend
Create `frontend/.env` from `frontend/.env.example`:
\`\`\`
VITE_API_URL=http://localhost:3000
\`\`\`

## Development

- **Backend**: Modify service files in `backend/*/src`, restart container
- **Frontend**: Run `npm run dev` for hot reload
- **See**: [STRUCTURE.md](./STRUCTURE.md) for detailed structure

## Deployment

For production deployment guide, see [backend/DEPLOYMENT.md](./backend/DEPLOYMENT.md)

### Supported Platforms
- Docker Compose (Development/Small deployments)
- Kubernetes (Production)
- AWS ECS / Fargate
- Google Cloud Run
- Azure Container Instances
- Netlify (Frontend)
- Vercel (Frontend)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, please refer to:
- Backend documentation: `backend/API_DOCUMENTATION.md`
- Deployment guide: `backend/DEPLOYMENT.md`
- Project structure: `STRUCTURE.md`

## Roadmap

- [ ] Real-time notifications with WebSockets
- [ ] Advanced analytics dashboard
- [ ] Machine learning recommendations
- [ ] Subscription & loyalty programs
- [ ] Multi-language support
- [ ] Mobile app (iOS/Android)
- [ ] Advanced search with Elasticsearch
- [ ] Caching layer with Redis
- [ ] API rate limiting
- [ ] Comprehensive logging & monitoring
