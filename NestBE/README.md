# Intensity Fitness Backend

A modern NestJS backend for a comprehensive fitness/gym management system. This system manages users (clients, trainers, admins), subscriptions (abonements), training sessions, and reservations with robust authentication and authorization.

## 🚀 Features

- **User Management**: Support for clients, trainers, and administrators
- **Authentication**: JWT-based authentication with Google OAuth 2.0 integration
- **Authorization**: Role-based access control (RBAC)
- **Subscription Management**: Flexible abonement/membership plans
- **Training Sessions**: Schedule and manage training sessions
- **Reservations**: Complete reservation system for clients
- **API Documentation**: Comprehensive Swagger/OpenAPI documentation
- **Validation**: Input validation with class-validator
- **Database**: MongoDB with Mongoose ODM
- **Security**: CORS, input sanitization, and secure password hashing

## 🛠️ Technology Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + Google OAuth 2.0  
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Security**: bcrypt, CORS, input validation

## 📁 Project Structure

```
src/
├── common/
│   ├── decorators/        # Custom decorators (GetUser, Roles)
│   └── enums.ts          # Application enums
├── config/
│   └── configuration.ts  # Application configuration
├── modules/
│   ├── auth/             # Authentication module
│   ├── users/            # User management module
│   ├── abonements/       # Subscription management (coming soon)
│   ├── trainings/        # Training sessions (coming soon)  
│   └── reservations/     # Reservation system (coming soon)
├── app.module.ts         # Root application module
└── main.ts              # Application bootstrap
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NestBE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Copy the `.env` file and update with your configuration:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/intensity-fitness
   
   # JWT Configuration  
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Frontend URL for CORS
   FRONTEND_URL=http://localhost:3001
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system or update the connection string for a cloud instance.

5. **Run the application**
   
   Development mode:
   ```bash
   npm run start:dev
   ```
   
   Production mode:
   ```bash
   npm run build
   npm run start:prod
   ```

### 🔗 API Documentation

Once the application is running, visit:
- **API Base URL**: `http://localhost:3000/api`
- **Swagger Documentation**: `http://localhost:3000/api/docs`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth authentication
- `GET /api/auth/profile` - Get current user profile

### Users  
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/trainers` - Get all trainers
- `GET /api/users/clients` - Get all clients (Admin/Trainer only)
- `GET /api/users/profile` - Get current user profile
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/profile` - Update current user profile
- `PATCH /api/users/:id` - Update user by ID (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `PATCH /api/users/:id/verify-email` - Verify user email (Admin only)

## 🧪 Testing

```bash
# Unit tests
npm run test

# e2e tests  
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🔒 Security Features

- **Password Hashing**: Using bcrypt for secure password storage
- **JWT Authentication**: Stateless authentication with configurable expiration
- **Role-based Authorization**: Granular access control based on user roles
- **Input Validation**: Comprehensive validation using class-validator
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Environment Variables**: Sensitive data stored in environment variables

## 📝 Database Schema

### User Schema
- Basic user information (email, name, phone)
- Role-based permissions (client, trainer, admin)
- Google OAuth integration
- Profile customization
- Emergency contact information
- Trainer-specific fields (specializations, certifications, experience)

### Future Schemas (Coming Soon)
- **Abonements**: Subscription plans and pricing
- **Trainings**: Training sessions and schedules  
- **Reservations**: Client reservations and bookings

## 🚀 Deployment

The application is containerized and ready for deployment to various platforms:

### Docker (Coming Soon)
```bash
docker build -t intensity-fitness-backend .
docker run -p 3000:3000 intensity-fitness-backend
```

### Environment Variables for Production
Ensure all environment variables are properly set in your production environment, especially:
- `JWT_SECRET` - Use a strong, unique secret
- `MONGODB_URI` - Production database connection
- `NODE_ENV=production`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues & Roadmap

### Current Status
- ✅ User management with role-based access
- ✅ JWT authentication with Google OAuth  
- ✅ API documentation with Swagger
- ✅ Input validation and security

### Coming Soon
- 🔄 Abonement/subscription management
- 🔄 Training session scheduling
- 🔄 Reservation system
- 🔄 Email notifications
- 🔄 Payment integration
- 🔄 Advanced reporting
- 🔄 Mobile app API endpoints

## 📞 Support

For support and questions, please open an issue in the GitHub repository.
