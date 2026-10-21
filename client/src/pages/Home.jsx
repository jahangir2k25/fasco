import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../api/axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Countdown from '../components/Countdown';
import PeakyBanner from '../components/PeakyBanner';
import InstagramStrip from '../components/InstagramStrip';
import Newsletter from '../components/Newsletter';

const brands = ['Chanel', 'Louis Vuitton', 'Prada', 'Calvin Klein', 'Denim'];
const categories = [
  "Men's Fashion",
  "Women's Fashion",
  'Women Accessories',
  'Men Accessories',
  'Discount Deals',
];

const heroImages = {
  left: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=85',
  group: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85',
  right: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=85',
  bottom: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=900&q=85',
};

const testimonials = [
  {
    quote:
      "You won't regret it. I would like to personally thank you for your outstanding product. Absolutely wonderful!",
    name: 'James K.',
    role: 'Traveler',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  },
  {
    quote:
      'Just what I was looking for. Thank you for making it painless, pleasant and most of all hassle free! All products are great.',
    name: 'Megen W.',
    role: 'UI Designer',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  },
  {
    quote:
      "Items That I ordered were the best investment I ever made. I can't say enough about your quality service.",
    name: 'Suzan B.',
    role: 'UI Designer',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activeCat, setActiveCat] = useState("Women's Fashion");
  const [dealTrackPosition, setDealTrackPosition] = useState(null);

  useEffect(() => {
    api.get('/products', { params: { featured: true, limit: 12 } }).then((res) => {
      setProducts(res.data.products);
    });
    api.get('/products', { params: { deal: true, limit: 6 } }).then((res) => {
      setDeals(res.data.products);
    });
  }, []);

  const filtered = products.filter((p) => p.category === activeCat).slice(0, 6);
  const displayProducts = filtered.length ? filtered : products.slice(0, 6);
  const carouselProducts = deals.length ? deals : products;
  const trackPosition = dealTrackPosition ?? carouselProducts.length;
  const dealSlides = [...carouselProducts, ...carouselProducts, ...carouselProducts];
  const slideWidth = carouselProducts.length ? 100 / (carouselProducts.length * 3) : 0;

  const resetDealTrack = () => {
    const itemCount = carouselProducts.length;
    if (itemCount > 1 && (trackPosition <= 0 || trackPosition >= itemCount * 2)) {
      setDealTrackPosition(itemCount);
    }
  };

  const moveDealTrack = (direction) => {
    const itemCount = carouselProducts.length;
    if (itemCount < 2) return;
    const currentPosition = dealTrackPosition ?? itemCount;
    setDealTrackPosition(currentPosition + direction);
  };

  return (
    <div>
      <Header />

      {/* Hero */}
      <section className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 md:px-8 md:py-10">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-[1fr_1.08fr_1fr] md:gap-6">
          <div className="col-span-2 flex min-h-[390px] flex-col items-center justify-center gap-3 text-center animate-fade-up md:col-span-1 md:col-start-2 md:row-start-1 md:min-h-[560px] md:gap-0">
            <img
              src={heroImages.group}
              alt="A group of models wearing the latest collection"
              className="h-[clamp(76px,10vw,116px)] w-full rounded-lg bg-[#e5e5e5] object-cover object-[center_35%]"
            />
            <div className="flex flex-1 flex-col items-center justify-center py-5">
              <h1 className="font-poppins text-[clamp(2rem,5.2vw,4.5rem)] font-semibold leading-none tracking-[0.025em] text-[#4a4a4a]">
                ULTIMATE
              </h1>
              <p
                aria-label="Sale"
                className="hero-sale-outline -mt-1 font-poppins text-[clamp(4rem,9vw,7rem)] font-medium leading-[0.98] tracking-[0.025em]"
              >
                SALE
              </p>
              <p className="mt-3 text-xs tracking-[0.16em] text-[#4a4a4a] sm:text-sm">
                NEW COLLECTION
              </p>
              <Link to="/shop" className="btn-primary mt-4 min-w-[160px] rounded-lg px-8 py-3 text-sm shadow-lg shadow-black/15">
                SHOP NOW
              </Link>
            </div>
            <img
              src={heroImages.bottom}
              alt="Models in the new FASCO collection"
              className="h-[clamp(76px,10vw,116px)] w-full rounded-lg bg-[#f3a08e] object-cover object-[center_35%]"
            />
          </div>
          <div className="relative order-2 min-h-[250px] overflow-hidden rounded-lg bg-[#e5e5e5] animate-fade-up animate-delay-1 md:order-none md:col-start-1 md:row-start-1 md:min-h-[560px]">
            <img
              src={heroImages.left}
              alt="Model wearing a contemporary outfit"
              className="absolute inset-0 h-full w-full object-cover object-[center_25%]"
            />
          </div>
          <div className="relative order-3 min-h-[250px] overflow-hidden rounded-lg bg-[#e5e5e5] animate-fade-up animate-delay-2 md:order-none md:col-start-3 md:row-start-1 md:min-h-[560px]">
            <img
              src={heroImages.right}
              alt="Model showcasing a modern fashion look"
              className="absolute inset-0 h-full w-full object-cover object-[center_25%]"
            />
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="border-y border-fasco-line py-8">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-8 px-4 md:justify-between md:px-8">
          {brands.map((b) => (
            <span key={b} className="font-volkhov text-xl text-black/70 md:text-2xl">
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* Deals */}
      <section className="mx-auto max-w-[1280px] px-4 py-16 md:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="font-volkhov text-3xl md:text-4xl">Deals Of The Month</h2>
            <p className="mt-4 max-w-md text-sm text-fasco-muted">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices
              sollicitudin aliquam sem. Scelerisque duis ultrices sollicitudin
            </p>
            <Link to="/shop" className="btn-primary mt-6">
              Buy Now
            </Link>
            <p className="mt-8 text-sm font-medium">Hurry, Before It&apos;s Too Late!</p>
            <div className="mt-4">
              <Countdown />
            </div>
          </div>
          <div>
            <div className="overflow-hidden">
              <div
                className="flex w-[900%] sm:w-[300%]"
                onTransitionEnd={resetDealTrack}
                style={{
                  transform: `translateX(-${trackPosition * slideWidth}%)`,
                  transition: 'transform 500ms ease-in-out',
                }}
              >
                {dealSlides.map((p, i) => (
                  <div
                    key={`${p._id}-${i}`}
                    className="relative shrink-0 px-2"
                    style={{ flexBasis: `${slideWidth}%` }}
                  >
                    <img src={p.images?.[0]} alt={p.name} className="aspect-[3/4] w-full object-cover" />
                    <div className="absolute bottom-4 left-4 bg-white px-3 py-2 text-xs shadow">
                      <p className="font-semibold">
                        0{(i % carouselProducts.length) + 1} — Spring Sale
                      </p>
                      <p className="text-fasco-muted">30% OFF</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                aria-label="Show previous deals"
                className="border border-black p-2 hover:bg-black hover:text-white"
                onClick={() => moveDealTrack(-1)}
                disabled={carouselProducts.length < 2}
              >
                <FiChevronLeft />
              </button>
              <button
                type="button"
                aria-label="Show next deals"
                className="border border-black p-2 hover:bg-black hover:text-white"
                onClick={() => moveDealTrack(1)}
                disabled={carouselProducts.length < 2}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section id="arrivals" className="mx-auto max-w-[1280px] px-4 py-10 md:px-8">
        <div className="text-center">
          <h2 className="font-volkhov text-3xl md:text-4xl">New Arrivals</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-fasco-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices
            sollicitudin aliquam sem. Scelerisque duis ultrices sollicitudin
          </p>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCat(c)}
              className={`px-4 py-2 text-sm transition ${activeCat === c ? 'bg-black text-white' : 'bg-fasco-soft hover:bg-black/10'
                }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {displayProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/shop" className="btn-primary">
            View More
          </Link>
        </div>
      </section>

      <PeakyBanner />

      {/* Features */}
      <section className="mx-auto grid max-w-[1280px] gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4 md:px-8">
        {[
          ['High Quality', 'crafted from top materials'],
          ['Warrany Protection', 'Over 2 years'],
          ['Free Shipping', 'Order over 150 $'],
          ['24 / 7 Support', 'Dedicated support'],
        ].map(([title, sub]) => (
          <div key={title} className="text-center">
            <p className="font-medium">{title}</p>
            <p className="mt-1 text-sm text-fasco-muted">{sub}</p>
          </div>
        ))}
      </section>

      <InstagramStrip />

      {/* Testimonials */}
      <section className="bg-fasco-soft py-16">
        <div className="mx-auto max-w-[1280px] px-4 text-center md:px-8">
          <h2 className="font-volkhov text-3xl md:text-4xl">This Is What Our Customers Say</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-fasco-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices
            sollicitudin aliquam sem. Scelerisque duis ultrices sollicitudin
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <article key={t.name} className="bg-white p-6 text-left shadow-md shadow-black/5">
                <div className="flex items-center gap-4">
                  <img src={t.img} alt={t.name} className="h-14 w-14 rounded-full object-cover" />
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-fasco-muted">{t.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-fasco-muted">&ldquo;{t.quote}&rdquo;</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
}
