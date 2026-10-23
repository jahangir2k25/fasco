import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

const packages = [
  {
    id: 'essential',
    number: '01',
    name: 'Essential',
    tier: 'BASIC',
    price: 29,
    itemCount: 3,
    benefits: ['Everyday outfits', 'Standard delivery'],
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85',
  },
  {
    id: 'signature',
    number: '02',
    name: 'Signature',
    tier: 'PREMIUM',
    price: 59,
    itemCount: 6,
    benefits: ['Premium outfits', 'Free delivery'],
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=85',
    popular: true,
  },
  {
    id: 'elite',
    number: '03',
    name: 'Elite',
    tier: 'LUXURY',
    price: 99,
    itemCount: 10,
    benefits: ['Designer selections', 'Priority delivery'],
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85',
  },
  {
    id: 'personalized',
    number: '04',
    name: 'Personalized',
    tier: 'CUSTOM',
    price: 129,
    itemCount: 12,
    benefits: ['A look tailored to you', 'Personal stylist support'],
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=85',
  },
];

export default function Packages() {
  return (
    <div>
      <Header />
      <main className="mx-auto max-w-[1280px] px-4 py-8 md:px-8">
        <section className="bg-[#171717] px-5 py-10 text-center text-white md:py-14">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#d8a0ad]">
            Exclusive style collection
          </p>
          <h1 className="mt-3 font-volkhov text-3xl md:text-4xl">Choose Your Style</h1>
          <p className="mt-3 text-sm text-white/75">
            Discover fashion packages designed for every occasion.
          </p>
        </section>

        <section aria-label="Fashion packages" className="grid gap-5 py-6 sm:grid-cols-2">
          {packages.map((plan) => (
            <article
              key={plan.id}
              className={`overflow-hidden rounded-xl border bg-white ${
                plan.popular ? 'border-[#bd7c8b]' : 'border-fasco-line'
              }`}
            >
              <Link
                to="/shop"
                aria-label={`Explore ${plan.name} package styles`}
                className="block overflow-hidden bg-fasco-soft"
              >
                <img
                  src={plan.image}
                  alt={`${plan.name} fashion package`}
                  className="aspect-[4/3] w-full object-cover transition duration-500 hover:scale-105"
                />
              </Link>
              <div className="p-5">
                <div className="flex min-h-6 items-center justify-between gap-2">
                  <p className="text-xs uppercase tracking-wide text-fasco-muted">
                    {plan.number} · {plan.tier}
                  </p>
                  {plan.popular && (
                    <span className="rounded-full bg-[#f3e5f7] px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-[#8b5a9a]">
                      Most popular
                    </span>
                  )}
                </div>
                <h2 className="mt-2 font-volkhov text-2xl">{plan.name}</h2>
                <p className="mt-1 text-2xl font-medium">${plan.price}</p>
                <p className="mt-2 text-sm text-fasco-muted">
                  {plan.itemCount} curated fashion items
                </p>
                <ul className="mt-2 space-y-1 text-sm text-fasco-muted">
                  {plan.benefits.map((benefit) => (
                    <li key={benefit}>· {benefit}</li>
                  ))}
                </ul>
                <Link
                  to="/shop"
                  className={`mt-4 flex w-full items-center justify-center rounded-md px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 ${
                    plan.popular ? 'bg-[#bd7c8b]' : 'bg-[#171717]'
                  }`}
                >
                  Choose Plan
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
