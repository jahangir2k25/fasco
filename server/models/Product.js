import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, default: 'Al Karam' },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    images: [{ type: String }],
    category: {
      type: String,
      enum: [
        "Men's Fashion",
        "Women's Fashion",
        'Women Accessories',
        'Men Accessories',
        'Discount Deals',
      ],
      default: "Women's Fashion",
    },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    rating: { type: Number, default: 4.5 },
    reviewsCount: { type: Number, default: 4100 },
    stock: { type: Number, default: 20 },
    badge: { type: String, default: 'Almost Sold Out' },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    deal: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
