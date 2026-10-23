import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('fasco_wishlist') || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('fasco_wishlist', JSON.stringify(items));
  }, [items]);

  const addToWishlist = (product) => {
    setItems((current) =>
      current.some((item) => item._id === product._id) ? current : [...current, product]
    );
  };

  const removeFromWishlist = (productId) => {
    setItems((current) => current.filter((item) => item._id !== productId));
  };

  const isWishlisted = (productId) => items.some((item) => item._id === productId);
  const count = useMemo(() => items.length, [items]);

  return (
    <WishlistContext.Provider
      value={{ items, addToWishlist, removeFromWishlist, isWishlisted, count }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
