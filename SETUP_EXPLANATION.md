# Complete Setup Explanation

## What We Did - Step by Step

### 1. **Cloned Both Repositories Locally**
   - **Frontend (zipli-dark)**: Cloned from `https://github.com/rhiday/zipli-dark.git`
   - **Backend (account_settings)**: Cloned from `https://github.com/ArfanGit/account_settings.git`
   - Both are now in `D:\Z-front\` directory
   - We're on the `main` branch for both repos

### 2. **Current Architecture (LOCAL DEVELOPMENT ONLY)**

```
┌─────────────────────────────────────────────────────────┐
│  YOUR LOCAL MACHINE (D:\Z-front\)                       │
│                                                          │
│  ┌──────────────────┐    ┌──────────────────┐         │
│  │  Frontend        │    │  Backend          │         │
│  │  (zipli-dark)    │    │  (account_settings)│         │
│  │                  │    │                  │         │
│  │  Next.js Dev     │───▶│  NestJS + Fastify│         │
│  │  Server          │    │  Server          │         │
│  │  Port: 3000      │    │  Port: 8002      │         │
│  │                  │    │                  │         │
│  │  Running via:    │    │  Running via:    │         │
│  │  npm run dev     │    │  npm run start:dev│        │
│  └──────────────────┘    └────────┬─────────┘         │
│                                    │                    │
│                                    ▼                    │
│                          ┌──────────────────┐          │
│                          │  PostgreSQL      │          │
│                          │  (Docker)        │          │
│                          │  Port: 5432     │          │
│                          └──────────────────┘          │
└─────────────────────────────────────────────────────────┘
```

### 3. **Where Everything Runs**

#### **Frontend (zipli-dark)**
- **Location**: `D:\Z-front\zipli-dark\`
- **How it runs**: Local Next.js development server (`npm run dev`)
- **URL**: `http://localhost:3000`
- **NOT hosted anywhere** - runs on your local machine
- **NOT using Vercel** - this is pure local development
- **Branch**: `main` (we cloned the default branch)

#### **Backend (account_settings)**
- **Location**: `D:\Z-front\account_settings\`
- **How it runs**: Local NestJS development server (`npm run start:dev`)
- **URL**: `http://localhost:8002`
- **NOT hosted anywhere** - runs on your local machine
- **Branch**: `main` (we cloned the default branch)

#### **Database (PostgreSQL)**
- **How it runs**: Docker container
- **Port**: `5432`
- **Database name**: `fastify_crud`
- **NOT a separate server** - runs in Docker on your local machine

### 4. **What We Integrated**

1. **Created API Client** (`src/lib/api/client.ts`)
   - Handles HTTP requests to backend
   - Manages JWT tokens in localStorage
   - Connects frontend to `http://localhost:8002`

2. **Created Auth Context** (`src/contexts/AuthContext.tsx`)
   - Global authentication state
   - Login, register, logout functions
   - Auto-loads user profile

3. **Updated Login Form** (`src/app/(auth)/sign-in/components/login-form-1.tsx`)
   - Now uses real backend API instead of mock
   - Calls `POST /login` endpoint

4. **Updated Settings Pages**
   - Account settings: Update profile, change password, delete account
   - User profile: Update profile (limited by backend)

5. **Environment Configuration**
   - Created `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8002`
   - Backend `.env` with database connection

### 5. **Current Issues**

#### **Problem**: Server crashes after login
**Root Cause**: Dashboard layout (`src/app/(dashboard)/layout.tsx`) is using `localStorage` check instead of `AuthContext`. This causes:
- Race condition between login and dashboard load
- Server-side rendering issues (localStorage not available on server)
- Potential crashes

**Solution**: Update dashboard layout to use `AuthContext` (Step 6 in our plan)

### 6. **Development vs Production**

#### **Current Setup (Development)**
- ✅ Everything runs locally on your machine
- ✅ Frontend: `localhost:3000` (Next.js dev server)
- ✅ Backend: `localhost:8002` (NestJS dev server)
- ✅ Database: Docker container on `localhost:5432`
- ✅ Hot reload enabled (changes reflect immediately)
- ✅ No deployment needed
- ✅ Perfect for experimentation

#### **Production Setup (Future - NOT DONE)**
- Frontend would be deployed to Vercel
- Backend would be deployed to a cloud service (Railway, Render, AWS, etc.)
- Database would be a managed PostgreSQL service
- Environment variables would be set in deployment platform
- This is NOT what we're doing now

### 7. **What Branch Are We On?**

- **Frontend**: `main` branch (default)
- **Backend**: `main` branch (default)
- We cloned the default branch from both repos
- All changes are local (not committed/pushed)

### 8. **Your Plan: Experimentation**

✅ **Perfect for experimentation:**
- Everything runs locally
- No deployment needed
- Easy to test changes
- Can break things without affecting production
- Can switch branches easily
- Can test different configurations

### 9. **How to Continue**

1. **Fix the crash** (update dashboard layout)
2. **Test login flow** (create user → login → access dashboard)
3. **Test profile updates** (update settings)
4. **Experiment with features** (add new endpoints, test different flows)

### 10. **Important Notes**

- **No Vercel deployment** - everything is local
- **No production hosting** - pure development environment
- **Database in Docker** - but still on your local machine
- **All changes are local** - not pushed to GitHub
- **Can experiment freely** - nothing affects production
