# Copilot Instructions for Intensity Fitness App Backend

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a NestJS backend for a fitness/gym management system called "Intensity". The system manages users (clients, trainers, admins), subscriptions (abonements), training sessions, reservations, and authentication.

## Architecture & Best Practices
- Use NestJS modular architecture with modules, services, controllers, and DTOs
- Follow Domain-Driven Design (DDD) principles
- Use dependency injection throughout
- Implement proper error handling with custom exceptions
- Use guards for authentication and authorization
- Implement validation with class-validator and DTOs
- Use interceptors for logging and response transformation
- Follow RESTful API design principles

## Technology Stack
- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + Google OAuth 2.0
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

## Domain Entities
- **User**: Base entity for all users (clients, trainers, admins)
- **Abonement**: Subscription/membership plans
- **Training**: Training sessions and schedules
- **Reservation**: User reservations for training sessions
- **Auth**: Authentication and authorization

## Code Style Guidelines
- Use TypeScript strict mode
- Follow NestJS naming conventions
- Use dependency injection for all services
- Implement proper DTOs for all API endpoints
- Use decorators for validation, authentication, and documentation
- Handle errors with proper HTTP status codes
- Log important operations and errors
- Write unit and integration tests for all features

## Security Considerations
- Validate all input data
- Use guards for protected routes
- Implement rate limiting
- Sanitize database queries
- Use environment variables for sensitive data
- Implement proper CORS configuration
