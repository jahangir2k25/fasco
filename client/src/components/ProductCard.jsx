import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

export default function ProductCard({ product }) {
  const reviews = product.reviewsCount >= 1000
    ? `(${(product.reviewsCount / 1000).toFixed(1)}k) Customer Reviews`
    : `(${product.reviewsCount}) Customer Reviews`;

  return (
    <Link
      to={`/product/${product._id}`}
      className="group block animate-fade-up transition duration-300 hover:-translate-y-1"
    >
      <div className="overflow-hidden bg-fasco-soft">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 space-y-1">
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
      </div>
    </Link>
  );
}
