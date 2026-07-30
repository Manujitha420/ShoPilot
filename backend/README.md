# ShoPilot Standalone Express & Prisma Backend API

This directory contains the standalone backend service for **ShoPilot**. It provides server-persisted user authentication (JWT + Refresh Tokens), database-backed Cart, Wishlist, Orders snapshot engine, and rate-limited AI Proxy services.

---

## 🛠 Tech Stack

- **Runtime**: Node.js + Express (TypeScript)
- **Database & ORM**: SQLite / PostgreSQL with Prisma ORM
- **Authentication**: JWT Access Tokens (15m) + Refresh Tokens (7d) stored in Database
- **Validation**: Zod schema validation middleware
- **Password Hashing**: bcryptjs

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables (`.env`)
The backend is pre-configured with SQLite out of the box:
```env
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_ACCESS_SECRET="shopilot_super_secret_access_token_key_2026"
JWT_REFRESH_SECRET="shopilot_super_secret_refresh_token_key_2026"
NVIDIA_NIM_API_KEY="39ca959c-edb6-4698-b481-2dac15fb9819"
CORS_ORIGIN="http://localhost:3000"
```

### 3. Initialize & Sync Database Schema
Run Prisma database push to generate the local SQLite database (`dev.db`):
```bash
npm run prisma:generate
npm run prisma:push
```

### 4. Start Development Server
```bash
npm run dev
```
The API server will start on **`http://localhost:5000`**.

---

## 📌 API Endpoints Reference

### 🔐 Authentication (`/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register new user (email, password, name) | No |
| `POST` | `/auth/login` | Login user, returns access & refresh tokens | No |
| `POST` | `/auth/refresh` | Issue new access token using refresh token | No |
| `GET`  | `/auth/me` | Fetch current user profile | Yes (Bearer) |

### 🛒 Cart (`/cart`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET`  | `/cart` | Fetch user's server-persisted cart | Yes (Bearer) |
| `POST` | `/cart/items` | Add product to cart (`productId`, `quantity`) | Yes (Bearer) |
| `PATCH`| `/cart/items/:id` | Update quantity of cart item | Yes (Bearer) |
| `DELETE`| `/cart/items/:id` | Remove item from cart | Yes (Bearer) |
| `DELETE`| `/cart` | Clear entire cart | Yes (Bearer) |

### ❤️ Wishlist (`/wishlist`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET`  | `/wishlist` | Fetch user's saved wishlist products | Yes (Bearer) |
| `POST` | `/wishlist/items` | Add product to wishlist (`productId`) | Yes (Bearer) |
| `DELETE`| `/wishlist/items/:productId` | Remove product from wishlist | Yes (Bearer) |

### 📦 Orders (`/orders`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/orders` | Checkout current cart into a snapshot Order | Yes (Bearer) |
| `GET`  | `/orders` | List user's past orders (with pagination) | Yes (Bearer) |
| `GET`  | `/orders/:id` | Get detailed order summary by ID | Yes (Bearer) |

### 🤖 AI Proxy (`/ai`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/ai` | Server-side AI proxy calling NVIDIA Llama-3.3-70B model | Yes (Bearer) |
