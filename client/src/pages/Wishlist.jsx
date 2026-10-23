import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';

export default function Wishlist() {
  const { items } = useWishlist();

  return (
    <div>
      <Header minimal />
      <main className="mx-auto max-w-[1280px] px-4 py-8 md:px-8">
        <p className="text-sm text-fasco-muted">
          <Link to="/" className="hover:underline">Home</Link> / Wishlist
        </p>
        <h1 className="mt-2 font-volkhov text-4xl">My Wishlist</h1>

        {items.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-fasco-muted">Your wishlist is empty.</p>
            <Link to="/shop" className="btn-primary mt-6 inline-flex">
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
