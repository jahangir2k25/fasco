import express from 'express';
import { memoryAuth, memoryOrders, memoryProducts } from '../store/memory.js';

const router = express.Router();

router.post('/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    const user = await memoryAuth.register({ firstName, lastName, email, phone, password });
    const token = memoryAuth.signToken(user._id);
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await memoryAuth.login(email, password);
    const token = memoryAuth.signToken(user._id);
    res.json({
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

router.get('/auth/me', async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(header.split(' ')[1], process.env.JWT_SECRET);
    const user = await memoryAuth.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    res.json({ user });
  } catch {
    res.status(401).json({ message: 'Not authorized' });
  }
});

router.get('/products', async (req, res) => {
  try {
    const { category, size, color, tag, sort, featured, deal, search, page = 1, limit = 9 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (size) filter.sizes = size;
    if (color) filter.colors = color;
    if (tag) filter.tags = tag;
    if (featured === 'true') filter.featured = true;
    if (deal === 'true') filter.deal = true;
    if (search) filter.name = { $regex: search, $options: 'i' };

    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const { products, total } = await memoryProducts.find(filter, {
      sort: sortOption,
      skip,
      limit: limitNum,
    });

    res.json({
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/products/:id', async (req, res) => {
  const product = await memoryProducts.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

router.post('/orders', async (req, res) => {
  try {
    const {
      orderItems,
      contactEmail,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice = 0,
      discount = 0,
      totalPrice,
      wrapProduct = false,
    } = req.body;

    if (!orderItems?.length) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = await memoryOrders.create({
      orderItems,
      contactEmail,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      discount,
      totalPrice,
      wrapProduct,
      isPaid: true,
      paidAt: new Date(),
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
