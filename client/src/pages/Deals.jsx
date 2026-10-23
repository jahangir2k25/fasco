import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import Countdown from '../components/Countdown';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function Deals() {
  const [result, setResult] = useState({ products: [], error: '', loaded: false });
  const [addedProductId, setAddedProductId] = useState('');
  const { addToCart } = useCart();
  const { products, error, loaded } = result;

  useEffect(() => {
    const controller = new AbortController();

    api
      .get('/products', {
        params: { deal: true, limit: 50, sort: 'newest' },
        signal: controller.signal,
      })
      .then(({ data }) => {
        setResult({ products: data.products, error: '', loaded: true });
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setResult({
            products: [],
            error: requestError.response?.data?.message || 'Could not load flash deals.',
            loaded: true,
          });
        }
      });

    return () => controller.abort();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, {
      size: product.sizes?.[0] || 'M',
      color: product.colors?.[0],
    });
    setAddedProductId(product._id);
    window.setTimeout(() => setAddedProductId(''), 2000);
  };

  return (
    <div>
      <Header />
      <main>
        <section className="bg-black px-4 py-12 text-white md:py-16">
          <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              Limited-time offers
            </p>
            <h1 className="font-volkhov text-4xl md:text-6xl">Flash Deals</h1>
            <p className="max-w-xl text-sm text-white/70 md:text-base">
              Find your favorites at special prices before these offers end.
            </p>
            <Countdown daysAhead={2} />
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-4 py-12 md:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-volkhov text-3xl">Today&apos;s Best Offers</h2>
              <p className="mt-2 text-sm text-fasco-muted">
                Original prices, special deal prices, and limited-time savings.
              </p>
            </div>
            {loaded && !error && (
              <p className="text-sm text-fasco-muted">{products.length} Deals</p>
            )}
          </div>

          {!loaded && (
            <p className="py-20 text-center text-fasco-muted">Loading flash deals...</p>
          )}
          {error && <p role="alert" className="py-20 text-center text-red-600">{error}</p>}
          {loaded && !error && products.length === 0 && (
            <p className="py-20 text-center text-fasco-muted">There are no active deals right now.</p>
          )}

          {loaded && !error && products.length > 0 && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => {
                const originalPrice = Number(product.originalPrice);
                const price = Number(product.price);
                const discount = originalPrice > price
                  ? Math.round(((originalPrice - price) / originalPrice) * 100)
                  : 0;
                const added = addedProductId === product._id;

                return (
                  <article key={product._id} className="overflow-hidden border border-fasco-line">
                    <Link
                      to={`/product/${product._id}`}
                      aria-label={`View ${product.name}`}
                      className="relative block overflow-hidden bg-fasco-soft"
                    >
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="aspect-[4/3] w-full object-cover transition duration-500 hover:scale-105"
                      />
                      <span className="absolute left-4 top-4 bg-red-600 px-3 py-1 text-sm font-semibold text-white">
                        {discount > 0 ? `-${discount}%` : 'DEAL'}
                      </span>
                    </Link>
                    <div className="space-y-4 p-5">
                      <div>
                        <p className="text-xs text-fasco-muted">{product.brand}</p>
                        <Link
                          to={`/product/${product._id}`}
                          className="mt-1 block text-lg font-medium hover:underline"
                        >
                          {product.name}
                        </Link>
                      </div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-xl font-semibold">${price.toFixed(2)}</span>
                        {originalPrice > price && (
                          <span className="text-sm text-fasco-muted line-through">
                            ${originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="btn-primary w-full"
                      >
                        {added ? 'Added to Cart!' : 'Add to Cart'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
