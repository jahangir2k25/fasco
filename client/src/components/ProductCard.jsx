import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }) {
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product._id);
  const reviews = product.reviewsCount >= 1000
    ? `(${(product.reviewsCount / 1000).toFixed(1)}k) Customer Reviews`
    : `(${product.reviewsCount}) Customer Reviews`;

  return (
    <div className="group animate-fade-up transition duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden bg-fasco-soft">
        <Link to={`/product/${product._id}`} aria-label={`View ${product.name}`}>
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
        <button
          type="button"
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wishlisted}
          onClick={() => (
            wishlisted ? removeFromWishlist(product._id) : addToWishlist(product)
          )}
          className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow transition hover:scale-105 ${
            wishlisted ? 'text-red-500' : 'text-black'
          }`}
        >
          <FiHeart className={wishlisted ? 'fill-current' : ''} />
        </button>
      </div>
      <Link to={`/product/${product._id}`} className="mt-4 block space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium">{product.name}</h3>
          <div className="flex gap-0.5 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar key={i} className={`text-xs ${i < Math.round(product.rating) ? '' : 'opacity-30'}`} />
            ))}
          </div>
        </div>
        <p className="text-sm text-fasco-muted">{product.brand}</p>
        <p className="text-xs text-fasco-muted">{reviews}</p>
        <div className="flex items-center justify-between pt-1">
          <p className="font-medium">${Number(product.price).toFixed(2)}</p>
          {product.badge && (
            <span className="text-xs font-medium text-red-500">{product.badge}</span>
          )}
        </div>
        {product.colors?.length > 0 && (
          <div className="flex gap-2 pt-2">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c}
                className="h-3.5 w-3.5 rounded-full border border-black/10"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}
      </Link>
    </div>
  );
}
