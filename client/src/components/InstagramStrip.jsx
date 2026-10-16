const images = [
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80',
];

export default function InstagramStrip() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-16 text-center md:px-8">
      <h2 className="font-volkhov text-3xl md:text-4xl">Follow Us On Instagram</h2>
      <p className="mx-auto mt-4 max-w-xl text-sm text-fasco-muted">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices
        sollicitudin aliquam sem. Scelerisque duis ultrices sollicitudin
      </p>
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-5">
        {images.map((src) => (
          <img
            key={src}
            src={src}
            alt="Instagram"
            className="aspect-square w-full object-cover transition duration-300 hover:opacity-90"
          />
        ))}
      </div>
    </section>
  );
}
