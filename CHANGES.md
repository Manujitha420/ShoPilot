# Frontend Integration & Backend Migration Notes (`CHANGES.md`)

This document outlines the modifications made to connect the ShoPilot Next.js frontend to the standalone Express + Prisma backend API service.

---

## 1. Backend Service Configuration
- Created `/backend` directory housing Express, Prisma ORM, JWT authentication, SQLite/Postgres database drivers, Zod validation, and AI proxy routes.
- Configured environment variables in `backend/.env` running on `http://localhost:5000`.

---

## 2. Frontend Connection Points

### 🌐 API Base URL & Axios Client
- Set `NEXT_PUBLIC_BACKEND_URL=http://localhost:5000` in `ShoPilot/.env.local`.
- Created unified client in `src/services/api.client.ts` configured with automatic 401 token refresh interceptors (`POST /auth/refresh`).

### 🔐 Authentication Service (`useAuth.tsx`)
- Replaced mock/localStorage authentication with calls to Express server:
  - Login: `POST http://localhost:5000/auth/login`
  - Register: `POST http://localhost:5000/auth/register`
  - Session verification: `GET http://localhost:5000/auth/me`

### 🛒 Server-Persisted Cart
- Migrated cart storage from browser `localStorage` to database persistence via Express endpoints:
  - `GET http://localhost:5000/cart`
  - `POST http://localhost:5000/cart/items`
  - `DELETE http://localhost:5000/cart`

### ❤️ Server-Persisted Wishlist (`useFavorites.tsx`)
- Connected favorite heart toggles directly to database wishlist tables:
  - `GET http://localhost:5000/wishlist`
  - `POST http://localhost:5000/wishlist/items`
  - `DELETE http://localhost:5000/wishlist/items/:productId`

### 📦 Checkout & Order Snapshot
- Updated order creation in `app/checkout/page.tsx` to submit orders to `POST http://localhost:5000/orders`, snapshotting product prices at time of purchase and clearing database cart.

---

## 🚀 Running the Full Stack locally

1. **Start the Backend API Service**:
   ```bash
   cd backend
   npm install
   npm run prisma:generate
   npm run prisma:push
   npm run dev
   ```

2. **Start the Next.js Frontend**:
   ```bash
   npm run dev
   ```
