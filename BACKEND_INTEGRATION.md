# Backend Integration Guide

This document describes the integration between the zipli-dark frontend and the account_settings backend API.

## Overview

The frontend has been integrated with the NestJS backend API located at: https://github.com/ArfanGit/account_settings.git

## What Has Been Implemented

### 1. API Client Layer (`src/lib/api/`)
- **`client.ts`**: HTTP client for backend communication with JWT token management
- **`types.ts`**: TypeScript types matching backend DTOs

### 2. Authentication Context (`src/contexts/AuthContext.tsx`)
- Global authentication state management
- JWT token storage in localStorage
- Login, register, logout functions
- Auto-refresh user profile on mount

### 3. Updated Settings Pages
- **Account Settings** (`src/app/(dashboard)/settings/account/page.tsx`):
  - Profile update (firstName, lastName, email)
  - Password change (with validation matching backend requirements)
  - Account deletion (with password confirmation)
  
- **User Profile Settings** (`src/app/(dashboard)/settings/user/page.tsx`):
  - Profile update (firstName, lastName, email)
  - Note: Backend only supports these fields currently

### 4. Root Layout Updates
- Added `AuthProvider` wrapper
- Added `Toaster` for notifications

## Backend API Endpoints Used

### Authentication
- `POST /login` - Login with email/password
- `POST /users` - Register new user

### User Management
- `GET /users/me` - Get current user profile (requires auth)
- `PATCH /users/me` - Update profile (requires auth)
- `PATCH /users/me/password` - Change password (requires auth)
- `DELETE /users/me` - Soft delete account (requires auth)

## Backend Limitations

The backend currently only supports:
- `firstName` (optional)
- `lastName` (optional)
- `email` (required)
- `username` (read-only, set during registration)
- `role` (read-only, set during registration: 'donor' | 'receiver')

**Not supported yet:**
- phone, website, location, bio, company, timezone, language

## Environment Configuration

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8002
```

Default is `http://localhost:8002` if not set.

## How to Test

### 1. Start the Backend
```bash
cd account_settings
npm install
# Set up .env with DATABASE_URL, JWT_SECRET
npm run start:dev
# Backend runs on http://localhost:8002
```

### 2. Start the Frontend
```bash
cd zipli-dark
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

### 3. Test Flow
1. Navigate to `/sign-in` (you may need to create this page or use existing auth pages)
2. Register a new user or login
3. Navigate to `/settings/account` or `/settings/user`
4. Update profile information
5. Test password change
6. Test account deletion (careful!)

## Next Steps

### 1. Create Login/Signup Pages
The authentication context is ready, but you need to create UI pages:
- `/sign-in` - Login page
- `/sign-up` - Registration page

These pages should use:
```typescript
import { useAuth } from '@/contexts/AuthContext'

const { login, register } = useAuth()
```

### 2. Update Dashboard Layout
The dashboard layout (`src/app/(dashboard)/layout.tsx`) currently checks for `auth_token` in localStorage. Consider updating it to use the `useAuth()` hook instead:

```typescript
import { useAuth } from '@/contexts/AuthContext'

const { isAuthenticated, isLoading } = useAuth()
```

### 3. Extend Backend (Optional)
If you want to support additional profile fields:
- Update Prisma schema in `account_settings/prisma/schema.prisma`
- Add fields to `UpdateUserDto` in backend
- Run migrations
- Update frontend types and forms

## Password Requirements

The backend enforces:
- Minimum 8 characters
- At least one letter
- At least one number
- At least one special character (@$!%*#?&)

## Error Handling

All API calls use try/catch with toast notifications:
- Success: Green toast with success message
- Error: Red toast with error message from backend

## Token Management

- JWT tokens are stored in `localStorage` as `auth_token`
- Tokens are automatically included in API requests via `Authorization: Bearer <token>` header
- Token is cleared on logout
- Invalid tokens trigger automatic logout

## Files Created/Modified

### New Files
- `src/lib/api/client.ts`
- `src/lib/api/types.ts`
- `src/contexts/AuthContext.tsx`
- `BACKEND_INTEGRATION.md`

### Modified Files
- `src/app/layout.tsx` - Added AuthProvider and Toaster
- `src/app/(dashboard)/settings/account/page.tsx` - Integrated with backend
- `src/app/(dashboard)/settings/user/page.tsx` - Integrated with backend

## Troubleshooting

### CORS Issues
If you see CORS errors, ensure the backend has CORS enabled for `http://localhost:3000` in `main.ts`:

```typescript
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
})
```

### Token Not Persisting
Check browser localStorage - token should be stored as `auth_token`.

### 401 Unauthorized
- Token may have expired (default: 30 minutes)
- Token may be invalid
- User may need to login again

### Backend Not Responding
- Check backend is running on port 8002
- Check `NEXT_PUBLIC_API_URL` environment variable
- Check backend logs for errors
