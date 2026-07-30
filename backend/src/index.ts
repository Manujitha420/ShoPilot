import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import cartRoutes from './routes/cart.routes';
import wishlistRoutes from './routes/wishlist.routes';
import orderRoutes from './routes/order.routes';
import aiRoutes from './routes/ai.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Express Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Welcome Root Route
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Welcome to ShoPilot Express Backend API',
    health: '/health',
    timestamp: new Date(),
  });
});

// Health Check Endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'ShoPilot Express Backend API', timestamp: new Date() });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/orders', orderRoutes);
app.use('/ai', aiRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Backend Error Handler]:', err);
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ success: false, message });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 ShoPilot Backend Service running on http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
