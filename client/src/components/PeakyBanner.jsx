import { Link } from 'react-router-dom';

export default function PeakyBanner() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-12 md:px-8">
      <div className="grid overflow-hidden bg-[#f4f0ea] md:grid-cols-2">
        <div className="relative min-h-[360px]">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80"
            alt="Peaky Blinders"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-8 py-12 md:px-14">
          <p className="text-sm tracking-wide text-fasco-muted">Women Collection</p>
          <h2 className="mt-2 font-volkhov text-4xl italic md:text-5xl">Peaky Blinders</h2>
          <p className="mt-4 text-xs font-semibold underline underline-offset-4">DESCRIPTION</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-fasco-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices
            sollicitudin aliquam sem. Scelerisque duis ultrices sollicitudin. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit. Scelerisque duis.
          </p>
          <div className="mt-5 flex items-center gap-3 text-sm">
            <span>Size:</span>
            <span className="inline-flex h-7 w-7 items-center justify-center bg-black text-xs text-white">
              M
            </span>
          </div>
          <p className="mt-4 text-2xl font-medium">$100.00</p>
          <Link to="/shop" className="btn-primary mt-6 w-fit">
            Buy Now
          </Link>
        </div>
      </div>
    </section>
  );
}
