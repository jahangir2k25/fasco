import { useState } from 'react';

const leftImg =
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80';
const rightImg =
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80';

export default function Newsletter() {
  const [email, setEmail] = useState('michael@ymail.com');

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-16 md:px-8">
      <div className="grid items-center gap-6 md:grid-cols-[1fr_1.2fr_1fr]">
        <img src={leftImg} alt="" className="hidden h-[320px] w-full object-cover md:block" />
        <div className="px-2 text-center md:px-8">
          <h2 className="font-volkhov text-3xl md:text-4xl">Subscribe To Our Newsletter</h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-fasco-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices
            sollicitudin aliquam sem. Scelerisque duis ultrices sollicitudin
          </p>
          <form
            className="mx-auto mt-8 max-w-md"
            onSubmit={(e) => {
              e.preventDefault();
              alert(`Subscribed: ${email}`);
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-fasco-line px-4 py-3 text-center shadow-sm"
              placeholder="Email"
            />
            <button type="submit" className="btn-primary mt-5 w-full shadow-lg shadow-black/20">
              Subscribe Now
            </button>
          </form>
        </div>
        <img src={rightImg} alt="" className="hidden h-[320px] w-full object-cover md:block" />
      </div>
    </section>
  );
}
