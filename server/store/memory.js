import productsData from '../data/products.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

let products = productsData.map((p, i) => ({
  ...p,
  _id: `mem_${i + 1}`,
  createdAt: new Date(),
}));

let users = [];
let orders = [];

export const memoryReady = () => true;

export const memoryProducts = {
  async find(filter = {}, { sort, skip = 0, limit = 9 } = {}) {
    let list = [...products];

    if (filter.category) list = list.filter((p) => p.category === filter.category);
    if (filter.sizes) list = list.filter((p) => p.sizes?.includes(filter.sizes));
    if (filter.colors) list = list.filter((p) => p.colors?.includes(filter.colors));
    if (filter.tags) list = list.filter((p) => p.tags?.includes(filter.tags));
    if (filter.featured) list = list.filter((p) => p.featured);
    if (filter.deal) list = list.filter((p) => p.deal);
    if (filter.name?.$regex) {
      const re = new RegExp(filter.name.$regex, filter.name.$options || 'i');
      list = list.filter((p) => re.test(p.name));
    }

    if (sort?.createdAt === -1) {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort?.price === 1) list.sort((a, b) => a.price - b.price);
    else if (sort?.price === -1) list.sort((a, b) => b.price - a.price);
    else if (sort?.rating === -1) list.sort((a, b) => b.rating - a.rating);

    const total = list.length;
    return { products: list.slice(skip, skip + limit), total };
  },

  async findById(id) {
    return products.find((p) => p._id === id) || null;
  },
};

export const memoryAuth = {
  async register({ firstName, lastName, email, phone, password }) {
    if (users.find((u) => u.email === email.toLowerCase())) {
      const err = new Error('User already exists with this email');
      err.status = 400;
      throw err;
    }
    const user = {
      _id: crypto.randomUUID(),
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone: phone || '',
      password: await bcrypt.hash(password, 10),
    };
    users.push(user);
    return user;
  },

  async login(email, password) {
    const user = users.find((u) => u.email === email.toLowerCase());
    if (!user || !(await bcrypt.compare(password, user.password))) {
      const err = new Error('Invalid email or password');
      err.status = 401;
      throw err;
    }
    return user;
  },

  async findById(id) {
    const user = users.find((u) => u._id === id);
    if (!user) return null;
    const { password, ...safe } = user;
    return safe;
  },

  signToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  },
};

export const memoryOrders = {
  async create(payload) {
    const order = { _id: crypto.randomUUID(), ...payload, createdAt: new Date() };
    orders.push(order);
    return order;
  },
};
