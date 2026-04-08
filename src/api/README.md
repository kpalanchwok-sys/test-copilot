# Lockgate API

This is a mock API server for the Lockgate mobile application. It provides endpoints for authentication, boats, marketplace items, and user profiles.

## Installation

```bash
cd api
npm install
```

## Running the API Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server runs on port 3000 by default. You can change this by setting the PORT environment variable.

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/forgot-password` - Send password reset instructions

### Boats

- `GET /api/boats` - Get all boats
- `GET /api/boats/user/:userId` - Get boats belonging to a specific user
- `GET /api/boats/:id` - Get boat by ID
- `POST /api/boats` - Create a new boat
- `PUT /api/boats/:id` - Update boat details
- `DELETE /api/boats/:id` - Delete a boat

### Marketplace

- `GET /api/marketplace` - Get all marketplace items
- `GET /api/marketplace?category=Electronics` - Get items by category
- `GET /api/marketplace/:id` - Get item by ID
- `GET /api/marketplace/seller/:sellerId` - Get items by seller
- `POST /api/marketplace` - Create a new marketplace item
- `PUT /api/marketplace/:id` - Update marketplace item
- `DELETE /api/marketplace/:id` - Delete a marketplace item

### User Profile

- `GET /api/profile/:id` - Get user profile
- `PUT /api/profile/:id` - Update user profile
- `PUT /api/profile/:id/profile-image` - Update profile image
- `PUT /api/profile/:id/cover-image` - Update cover image
- `PUT /api/profile/:id/change-password` - Change password

## Notes

This API server uses in-memory data and is intended for development and testing only. All data will be reset when the server restarts.
