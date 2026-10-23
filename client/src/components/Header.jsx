import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiUser,
  FiHeart,
  FiShoppingBag,
  FiChevronDown,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../api/axios';

const links = [
  { to: '/', label: 'Home' },
  { to: '/deals', label: 'Deals' },
  { to: '/new-arrivals', label: 'New Arrivals' },
  { to: '/packages', label: 'Packages' },
  { to: '/shop', label: 'Shop' },
  { to: '/shop?category=Women%27s%20Fashion', label: 'Products' },
  // { to: '/#arrivals', label: 'Pages' },
];

export default function Header({ minimal = false }) {
  const navigate = useNavigate();
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const navigationLinks = links.filter((link) => link.label !== 'Shop' || user);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const headerRef = useRef(null);
  const searchInputRef = useRef(null);
  const menuRef = useRef(null);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchLoading(false);
  };

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        closeSearch();
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen || !searchTerm.trim()) return undefined;

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setSearchLoading(true);
      setSearchError('');
      try {
        const { data } = await api.get('/products', {
          params: { search: searchTerm.trim(), limit: 6 },
          signal: controller.signal,
        });
        setSearchResults(data.products);
      } catch (error) {
        if (!controller.signal.aborted) {
          setSearchError(error.response?.data?.message || 'Could not load search results.');
          setSearchResults([]);
        }
      } finally {
        if (!controller.signal.aborted) setSearchLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [searchOpen, searchTerm]);

  const submitSearch = (e) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;
    closeSearch();
    navigate(`/shop?search=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-fasco-line">
      <div ref={headerRef} className="relative mx-auto flex max-w-[1280px] items-center justify-between px-4 py-5 md:px-8">
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
          className="font-volkhov text-[28px] md:text-[32px] tracking-wide"
        >
          FASCO
        </Link>

        {!minimal && (
          <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm transition hover:opacity-70 ${isActive && link.to === '/' ? 'font-medium' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}

        {minimal && (
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm hover:opacity-70">
              Home
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-3 text-xl md:gap-4">
          {!minimal && (
            <>
              <button
                type="button"
                onClick={() => {
                  const nextOpen = !searchOpen;
                  setSearchOpen(nextOpen);
                  if (nextOpen && searchTerm.trim()) setSearchLoading(true);
                  else setSearchLoading(false);
                }}
                aria-label={searchOpen ? 'Close search' : 'Open search'}
                aria-expanded={searchOpen}
                aria-controls="product-search"
                className="cursor-pointer hover:opacity-60"
              >
                <FiSearch />
              </button>
              <Link
                to="/wishlist"
                aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ''}`}
                className="relative cursor-pointer hover:opacity-60"
              >
                <FiHeart />
                {wishlistCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {!minimal && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="text-xl md:hidden"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          )}

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 text-sm hover:opacity-70"
                aria-label="Profile menu"
              >
                <span className="flex h-8 w-8 items-center justify-center bg-black text-xs font-semibold text-white">
                  {(user.firstName?.[0] || 'U').toUpperCase()}
                </span>
                <span className="hidden max-w-30 truncate font-medium md:inline">
                  {user.firstName}
                </span>
                <FiChevronDown className="text-base" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 border border-fasco-line bg-white py-2 text-sm shadow-lg">
                  <div className="border-b border-fasco-line px-4 py-2">
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="truncate text-xs text-fasco-muted">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 hover:bg-fasco-soft"
                  >
                    My Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    className="block w-full px-4 py-2 text-left hover:bg-fasco-soft"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/signin"
              aria-label="Account"
              className="flex items-center gap-1 text-sm hover:opacity-60"
            >
              <FiUser className="text-xl" />
              <span className="hidden md:inline">Sign In</span>
            </Link>
          )}

          <Link to="/cart" aria-label="Cart" className="relative hover:opacity-60">
            <FiShoppingBag />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] text-white">
                {count}
              </span>
            )}
          </Link>
        </div>

        {!minimal && searchOpen && (
          <div
            id="product-search"
            className="absolute left-4 right-4 top-full z-50 border border-fasco-line bg-white p-4 shadow-xl md:left-8 md:right-8"
          >
            <form onSubmit={submitSearch} className="flex items-center gap-3 border-b border-fasco-line pb-3">
              <FiSearch className="shrink-0 text-fasco-muted" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSearchLoading(Boolean(e.target.value.trim()));
                  setSearchResults([]);
                  setSearchError('');
                }}
                placeholder="Search products by name..."
                aria-label="Search products by name"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSearchLoading(false);
                    setSearchResults([]);
                    setSearchError('');
                  }}
                  aria-label="Clear search"
                  className="text-xl text-fasco-muted hover:text-black"
                >
                  <FiX />
                </button>
              )}
              <button type="submit" className="text-sm font-medium hover:opacity-60">
                Search
              </button>
            </form>

            {searchTerm.trim() && (
              <div className="max-h-[min(60vh,360px)] overflow-y-auto pt-2">
                {searchLoading && <p className="py-4 text-sm text-fasco-muted">Searching products...</p>}
                {searchError && <p role="alert" className="py-4 text-sm text-red-600">{searchError}</p>}
                {!searchLoading && !searchError && searchResults.length === 0 && (
                  <p className="py-4 text-sm text-fasco-muted">No products found.</p>
                )}
                {!searchLoading && searchResults.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    onClick={closeSearch}
                    className="flex items-center gap-3 border-b border-fasco-line py-2 last:border-0 hover:bg-fasco-soft"
                  >
                    <img
                      src={product.images?.[0]}
                      alt=""
                      className="h-14 w-12 shrink-0 bg-fasco-soft object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{product.name}</span>
                      <span className="block text-xs text-fasco-muted">{product.brand}</span>
                    </span>
                    <span className="text-sm">${Number(product.price).toFixed(2)}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {!minimal && mobileMenuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="absolute left-0 right-0 top-full border-t border-fasco-line bg-white px-4 py-3 shadow-lg md:hidden"
          >
            {navigationLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-3 text-sm transition hover:opacity-70 ${
                    isActive && link.to === '/' ? 'font-medium' : ''
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
