# Authentication API 

## Overview

This is an application with RESTful authentication API built with Node.js(TypeScript), Express and Redis. It provides secure endpoints for user registration, authentication and a test route(to validate tokens) designed with Modular architecture(Model + Controller) for code readability and maintainability.

## Features

- **User Registration**: Creates users with unique usernames and securely hashed passwords.
- **Authentication**: Issues JWTs with a 1 hour expiration, validated using a unique JTI stored in Redis
- **Protected Routes**: Requires valid JWTs for access(eg. '/api/auth/test')
- **Input validation**: Ensures input checking with 'express-validator'
- **Rate Limiting**: Limits requests to prevent brute-force attacks(100 requests / 15 mins)
- **Security Headers**: Uses "helmet" to set HTTP security headers
- **Logging**: Implements 'winston' for structured logging
- **Redis Integration**: Stores data and token metadata with reconnection strategy
- **TypeScript**: Leverages TypeScript for strong typing and better code quality

## Setup
### Prerequisites
- Node.js (v22 or higher)
- Redis server

### Instalation
1. Clone the repository
2. Install dependencies using npm install
3. (Optional) Create a .env file in the project root and configure the required environment variables:
    - Generate a secure JWT_SECRET using openssl rand -hex 31 or a similar tool
    - For this project, I have added default values if .env is not present -> src/config/index.ts
4. Build the project using npm run build
5. Start the server using npm start
6. Ensure that the Redis server is running

### API Endpoints

**POST /api/auth/register**
- Creates a new user
    {
    "username": "string",
    "password": "string (min 8 chars, uppercase, lowercase, number, special char)"
    }
- Responses
    * 200: { message: 'User registered successfully' }
    * 400: { message: 'Username already exists' } or validation errors
    * 500: { error: 'Internal Server Error' }

**POST /api/auth/login**
- Authenticates a user and returns a JWT.
    {
    "username": "string",
    "password": "string"
    }
- Responses
    * 200: { message: 'Authentication successful', token: 'jwt-token' }
    * 400: Validation errors
    * 401: { message: 'Invalid username or password' }
    * 500: { error: 'Internal Server Error' }

**POST /api/lendesk/test**
- Tests protected route access (requires valid JWT).
- Headers
    * Authorization: Bearer <jwt-token>
- Responses
    * 200: { message: 'Authentication successful', token: 'jwt-token' }
    * 401: { error: 'JWT token is required' } or { error: 'Invalid or expired JWT token' }
    * 500: { error: 'Internal Server Error' }

### Testing
- Use tools like Postman or curl to test endpoints

### Future Enhancements
- **TLS Certification**:
    * Implement TLS/SSL certificates using a service like Let's Encrypt to enable HTTPS for all endpoints. This will encrypt data in transit.
    * Update index.ts to use https.createServer with a certificate and a key and configure Redis with **tls: true** to enforce encrypted connections
    * Example setup:
    
    import fs from 'fs';
    import https from 'https';
    
    const options = {
        key: fs.readFileSync('path/to/private.key'),
        cert: fs.readFileSync('path/to/certificate.crt'),
    };

    https.createServer(options, app).listen(443);

- **Refresh Tokens**:
    * Add support for refresh tokens to allow token renewal without re-authentication, improving user experience while maintaining security
    * Store refresh token jti in Redis with a separate key and expiration

- **Unit and Integration Tests**:
    * Add test scripts for controllers, middleware and models to ensure reliability as features expand.

- **Advanced Security**:
    * Add 2FA using time based OTPs via libraries like speakeasy

- **Monitoring and Alerts**:
    * Set up email alets for critical errors logged by winston
