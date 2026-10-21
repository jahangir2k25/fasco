import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import PeakyBanner from '../components/PeakyBanner';
import InstagramStrip from '../components/InstagramStrip';
import Newsletter from '../components/Newsletter';

const sizes = ['XS', 'S', 'M', 'L', 'XL'];
const colors = ['#000000', '#FFFFFF', '#C0C0C0', '#E8B4B8', '#1E3A5F', '#8B4513'];
const categories = [
  "Men's Fashion",
  "Women's Fashion",
  'Women Accessories',
  'Men Accessories',
  'Discount Deals',
];
const tags = ['Fashion', 'Dress', 'Jacket', 'Sale', 'Winter'];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [open, setOpen] = useState({ size: true, color: true, category: true, tags: true });

  const page = Number(searchParams.get('page') || 1);
  const sort = searchParams.get('sort') || '';
  const size = searchParams.get('size') || '';
  const color = searchParams.get('color') || '';
  const category = searchParams.get('category') || '';
  const tag = searchParams.get('tag') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    api
      .get('/products', {
        params: { page, limit: 9, sort, size, color, category, tag, search },
      })
      .then((res) => {
        setProducts(res.data.products);
        setTotal(res.data.total);
        setPages(res.data.pages);
      });
  }, [page, sort, size, color, category, tag, search]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || searchParams.get(key) === value) next.delete(key);
    else next.set(key, value);
    next.delete('page');
    setSearchParams(next);
  };

  return (
    <div>
      <Header />
      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-8">
        <p className="text-sm text-fasco-muted">
          <Link to="/" className="hover:underline">
            Home
          </Link>{' '}
          / Fashion
        </p>
        <h1 className="mt-2 font-volkhov text-4xl">
          {search ? `Search results for “${search}”` : 'Fashion'}
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
          <aside>
            <h2 className="mb-4 text-lg font-medium">Filters</h2>

            <div className="border-t border-fasco-line py-4">
              <button
                type="button"
                className="flex w-full justify-between font-medium"
                onClick={() => setOpen((o) => ({ ...o, size: !o.size }))}
              >
                Size <span>{open.size ? '−' : '+'}</span>
              </button>
              {open.size && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFilter('size', s)}
                      className={`h-9 min-w-9 border px-2 text-sm ${
                        size === s ? 'border-black bg-black text-white' : 'border-fasco-line'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-fasco-line py-4">
              <button
                type="button"
                className="flex w-full justify-between font-medium"
                onClick={() => setOpen((o) => ({ ...o, color: !o.color }))}
              >
                Color <span>{open.color ? '−' : '+'}</span>
              </button>
              {open.color && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFilter('color', c)}
                      className={`h-7 w-7 rounded-full border ${
                        color === c ? 'ring-2 ring-black ring-offset-2' : 'border-black/20'
                      }`}
                      style={{ backgroundColor: c }}
                      aria-label={c}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-fasco-line py-4">
              <button
                type="button"
                className="flex w-full justify-between font-medium"
                onClick={() => setOpen((o) => ({ ...o, category: !o.category }))}
              >
                Categories <span>{open.category ? '−' : '+'}</span>
              </button>
              {open.category && (
                <ul className="mt-3 space-y-2 text-sm">
                  {categories.map((c) => (
                    <li key={c}>
                      <button
                        type="button"
                        onClick={() => setFilter('category', c)}
                        className={`hover:underline ${category === c ? 'font-semibold' : 'text-fasco-muted'}`}
                      >
                        {c}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-b border-fasco-line py-4">
              <button
                type="button"
                className="flex w-full justify-between font-medium"
                onClick={() => setOpen((o) => ({ ...o, tags: !o.tags }))}
              >
                Tags <span>{open.tags ? '−' : '+'}</span>
              </button>
              {open.tags && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFilter('tag', t)}
                      className={`border px-3 py-1 text-xs ${
                        tag === t ? 'border-black bg-black text-white' : 'border-fasco-line'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>

          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-fasco-muted">{total} Results Found</p>
              <select
                value={sort}
                onChange={(e) => setFilter('sort', e.target.value)}
                className="border border-fasco-line px-3 py-2 text-sm"
              >
                <option value="">Sort by</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            {products.length === 0 && (
              <p className="py-20 text-center text-fasco-muted">No products match your filters.</p>
            )}

            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    next.set('page', String(i + 1));
                    setSearchParams(next);
                  }}
                  className={`h-2.5 w-2.5 rounded-full ${
                    page === i + 1 ? 'bg-black' : 'bg-black/20'
                  }`}
                  aria-label={`Page ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <PeakyBanner />
      <InstagramStrip />
      <Newsletter />
      <Footer />
    </div>
  );
}
