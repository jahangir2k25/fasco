import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import products from './data/products.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import memoryRoutes from './routes/memoryFallback.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const clientOrigin = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/+$/, '');

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'FASCO API is running',
    frontend: clientOrigin,
    health: '/api/health',
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    brand: 'FASCO',
    db: mongoose.connection.readyState === 1 ? 'mongo' : 'memory',
  });
});

const useMemory = () => mongoose.connection.readyState !== 1;

app.use('/api', (req, res, next) => {
  if (useMemory() && req.path.startsWith('/auth')) {
    if (process.env.NODE_ENV === 'production') {
      return res.status(503).json({
        message: 'Authentication is temporarily unavailable because the database is disconnected.',
      });
    }
    return memoryRoutes(req, res, next);
  }
  if (useMemory() && req.path.startsWith('/products')) return memoryRoutes(req, res, next);
  if (useMemory() && req.path.startsWith('/orders')) return memoryRoutes(req, res, next);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

const start = async () => {
  await connectDB();

  try {
    if (mongoose.connection.readyState === 1) {
      const count = await Product.countDocuments();
      if (count === 0) {
        await Product.insertMany(products);
        console.log(`Auto-seeded ${products.length} products`);
      }
    } else {
      console.log('Running with in-memory store (start MongoDB for persistence)');
    }
  } catch {
    console.log('Running with in-memory store');
  }

  app.listen(PORT, () => {
    console.log(`FASCO server running on http://localhost:${PORT}`);
  });
};

start();
