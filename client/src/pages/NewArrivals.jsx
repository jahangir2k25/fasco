import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const PRODUCTS_PER_PAGE = 12;

export default function NewArrivals() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [result, setResult] = useState({
    page: null,
    products: [],
    total: 0,
    pages: 1,
    error: '',
  });
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const loading = result.page !== page;
  const error = loading ? '' : result.error;
  const products = loading ? [] : result.products;
  const total = loading ? 0 : result.total;
  const pages = loading ? 1 : result.pages;

  useEffect(() => {
    const controller = new AbortController();

    api
      .get('/products', {
        params: { page, limit: PRODUCTS_PER_PAGE, sort: 'newest' },
        signal: controller.signal,
      })
      .then(({ data }) => {
        setResult({ page, ...data, error: '' });
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setResult({
            page,
            products: [],
            total: 0,
            pages: 1,
            error: requestError.response?.data?.message || 'Could not load new arrivals.',
          });
        }
      });

    return () => controller.abort();
  }, [page]);

  const goToPage = (nextPage) => {
    const next = new URLSearchParams(searchParams);
    if (nextPage === 1) next.delete('page');
    else next.set('page', String(nextPage));
    setSearchParams(next);
  };

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-[1280px] px-4 py-8 md:px-8">
        <p className="text-sm text-fasco-muted">
          <Link to="/" className="hover:underline">Home</Link> / New Arrivals
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-volkhov text-4xl">New Arrivals</h1>
            <p className="mt-2 text-sm text-fasco-muted">Discover the latest additions to our collection.</p>
          </div>
          {!loading && !error && (
            <p className="text-sm text-fasco-muted">{total} Products</p>
          )}
        </div>

        {loading && <p className="py-20 text-center text-fasco-muted">Loading new arrivals...</p>}
        {error && <p role="alert" className="py-20 text-center text-red-600">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p className="py-20 text-center text-fasco-muted">No new arrivals found.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            {pages > 1 && (
              <nav aria-label="New arrivals pages" className="mt-10 flex justify-center gap-2">
                {Array.from({ length: pages }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => goToPage(pageNumber)}
                    aria-label={`Page ${pageNumber}`}
                    aria-current={pageNumber === page ? 'page' : undefined}
                    className={`h-2.5 w-2.5 rounded-full ${
                      pageNumber === page ? 'bg-black' : 'bg-black/20'
                    }`}
                  />
                ))}
              </nav>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
