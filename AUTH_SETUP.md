# Admin Dashboard Authentication Setup

This guide explains how to set up and use the authentication system for the Fitflix Admin Dashboard.

## Backend Setup

### 1. Install Dependencies
The required packages are already installed in the backend:
- `bcryptjs` - for password hashing
- `jsonwebtoken` - for JWT tokens
- `cookie-parser` - for handling cookies
- `@prisma/client` - for database operations

### 2. Environment Variables
Create a `.env` file in the backend root with:
```env
JWT_SECRET=your-super-secret-jwt-key-here
ADMIN_DASHBOARD_URL=http://localhost:5173
```

### 3. Database Setup
Run the following commands to set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:dev:migrate

# Seed admin user
npm run db:seed:admin
```

### 4. Start Backend Server
```bash
npm run dev
```

## Frontend Setup

### 1. Install Dependencies
The required packages are already installed in the admin dashboard.

### 2. Start Admin Dashboard
```bash
npm run dev
```

## Authentication Flow

### 1. Login Process
1. User enters credentials on `/login` page
2. Frontend sends POST request to `/api/auth/login`
3. Backend validates credentials and creates JWT token
4. JWT is stored as HTTP-only cookie
5. User info is stored in localStorage
6. User is redirected to `/admin` dashboard

### 2. Protected Routes
- All admin routes (`/admin/*`) require authentication
- `ProtectedRoute` component verifies JWT token with backend
- Routes are protected with `requireAdmin={true}`

### 3. Token Verification
- JWT tokens are automatically verified on each protected route access
- Invalid/expired tokens redirect to login page
- HTTP-only cookies provide security against XSS attacks

## Default Admin Credentials

After running the seed script:
- **Email**: admin@fitflix.com
- **Password**: admin123

## Security Features

- **JWT Tokens**: 24-hour expiration
- **HTTP-only Cookies**: Prevents XSS attacks
- **Role-based Access**: Only admin users can access dashboard
- **Automatic Logout**: Invalid tokens trigger immediate logout
- **Secure Headers**: Helmet.js provides security headers

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/verify` - Verify JWT token

### Protected Routes
All admin routes require valid JWT token and admin role.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `ADMIN_DASHBOARD_URL` is set correctly
2. **JWT Verification Fails**: Check `JWT_SECRET` environment variable
3. **Database Connection**: Ensure Prisma is properly configured
4. **Cookie Issues**: Check browser cookie settings and CORS configuration

### Debug Steps

1. Check browser console for frontend errors
2. Check backend console for server errors
3. Verify JWT token in browser cookies
4. Check database connection and user records

## Development Notes

- JWT tokens expire after 24 hours
- Users are automatically logged out on token expiration
- All API requests include credentials for cookie handling
- Authentication state is managed through React Context
- Protected routes show loading spinner during verification
