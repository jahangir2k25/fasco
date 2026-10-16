import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
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

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/shop?category=Women%27s%20Fashion', label: 'Products' },
  { to: '/#arrivals', label: 'Pages' },
];

export default function Header({ minimal = false }) {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-fasco-line">
      <div className="relative mx-auto flex max-w-[1280px] items-center justify-between px-4 py-5 md:px-8">
        <Link to="/" className="font-volkhov text-[28px] md:text-[32px] tracking-wide">
          FASCO
        </Link>

        {!minimal && (
          <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
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
              <button type="button" aria-label="Search" className="hidden hover:opacity-60 md:block">
                <FiSearch />
              </button>
              <button type="button" aria-label="Wishlist" className="hidden hover:opacity-60 md:block">
                <FiHeart />
              </button>
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
                <span className="hidden max-w-[120px] truncate font-medium md:inline">
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

        {!minimal && mobileMenuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="absolute left-0 right-0 top-full border-t border-fasco-line bg-white px-4 py-3 shadow-lg md:hidden"
          >
            {links.map((link) => (
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
