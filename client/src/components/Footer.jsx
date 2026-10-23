import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-fasco-line">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <Link to="/" className="font-volkhov text-[32px]">
          FASCO
        </Link>
        <div className="flex flex-wrap gap-6 text-sm text-black/80">
          {['Support Center', 'Invoicing', 'Contract', 'Careers', 'Blog', "FAQ's"].map((item) => (
            <a key={item} href="#" className="hover:opacity-60">
              {item}
            </a>
          ))}
        </div>
      </div>
      <p className="pb-8 text-center text-xs text-fasco-muted">
        Copyright © 2026 || Developed by Raj-Diversion . All Rights Reseved.
      </p>
    </footer>
  );
}
