import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { FiHeart, FiShare2, FiRefreshCw } from 'react-icons/fi';
import api from '../api/axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import PeakyBanner from '../components/PeakyBanner';
import Newsletter from '../components/Newsletter';
import Countdown from '../components/Countdown';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Product() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState('M');
  const [color, setColor] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => {
      setProduct(res.data);
      setSize(res.data.sizes?.[2] || res.data.sizes?.[0] || 'M');
      setColor(res.data.colors?.[0] || '');
      setActiveImg(0);
    });
    api.get('/products', { params: { limit: 4 } }).then((res) => {
      setRelated(res.data.products.filter((p) => p._id !== id).slice(0, 4));
    });
  }, [id]);

  if (!product) {
    return (
      <div>
        <Header minimal />
        <p className="py-32 text-center text-fasco-muted">Loading product...</p>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product, { quantity: qty, size, color });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };
  const wishlisted = isWishlisted(product._id);

  return (
    <div>
      <Header minimal />
      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-8">
        <p className="text-sm text-fasco-muted">
          <Link to="/" className="hover:underline">
            Home
          </Link>{' '}
          /{' '}
          <Link to="/shop" className="hover:underline">
            Shop
          </Link>{' '}
          / {product.name}
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[80px_1fr_1fr]">
          <div className="flex gap-3 lg:flex-col">
            {product.images?.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setActiveImg(i)}
                className={`overflow-hidden border ${
                  activeImg === i ? 'border-black' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="h-20 w-20 object-cover" />
              </button>
            ))}
          </div>

          <div className="overflow-hidden bg-fasco-soft">
            <img
              src={product.images?.[activeImg]}
              alt={product.name}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          <div>
            <h1 className="font-volkhov text-3xl md:text-4xl">{product.name}</h1>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
              </div>
              <span className="text-sm text-fasco-muted">
                ({product.reviewsCount}) Reviews
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-medium">${Number(product.price).toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-fasco-muted line-through">
                  ${Number(product.originalPrice).toFixed(2)}
                </span>
              )}
              <span className="bg-red-500 px-2 py-0.5 text-xs text-white">Save 20%</span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-fasco-muted">{product.description}</p>

            <div className="mt-6">
              <p className="mb-2 text-sm font-medium">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`h-10 min-w-10 border px-3 text-sm ${
                      size === s ? 'border-black bg-black text-white' : 'border-fasco-line'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-sm font-medium">Color</p>
              <div className="flex gap-2">
                {product.colors?.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-8 w-8 rounded-full border ${
                      color === c ? 'ring-2 ring-black ring-offset-2' : 'border-black/15'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-fasco-line">
                <button type="button" className="px-3 py-2" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  −
                </button>
                <span className="w-10 text-center">{qty}</span>
                <button type="button" className="px-3 py-2" onClick={() => setQty((q) => q + 1)}>
                  +
                </button>
              </div>
              <button type="button" onClick={handleAdd} className="btn-primary flex-1 min-w-[180px]">
                {added ? 'Added!' : 'Add to cart'}
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-5 text-sm text-fasco-muted">
              <button type="button" className="inline-flex items-center gap-2 hover:text-black">
                <FiRefreshCw /> Compare
              </button>
              <button
                type="button"
                onClick={() => (
                  wishlisted ? removeFromWishlist(product._id) : addToWishlist(product)
                )}
                aria-pressed={wishlisted}
                className="inline-flex items-center gap-2 hover:text-black"
              >
                <FiHeart className={wishlisted ? 'fill-current text-red-500' : ''} />
                {wishlisted ? 'Added to wishlist' : 'Add to wishlist'}
              </button>
              <button type="button" className="inline-flex items-center gap-2 hover:text-black">
                <FiShare2 /> Share
              </button>
            </div>

            <ul className="mt-6 space-y-2 text-sm text-fasco-muted">
              <li>Free shipping on orders over $150</li>
              <li>Easy 30-day returns</li>
              <li>Secure payment methods accepted</li>
            </ul>
          </div>
        </div>
      </div>

      <PeakyBanner />

      <section className="mx-auto max-w-[1280px] px-4 py-12 md:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-volkhov text-3xl">People Also Loved</h2>
            <p className="mt-2 text-sm text-fasco-muted">Hurry, Before It&apos;s Too Late!</p>
          </div>
          <Countdown daysAhead={3} />
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
}
