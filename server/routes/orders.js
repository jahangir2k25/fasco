import express from 'express';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', async (req, res) => {
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

    if (!contactEmail || !shippingAddress) {
      return res.status(400).json({ message: 'Contact and delivery info required' });
    }

    const order = await Order.create({
      user: req.headers.authorization ? undefined : undefined,
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

router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
