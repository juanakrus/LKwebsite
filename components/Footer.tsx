import Link from 'next/link';
import { Facebook, Instagram, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white py-10 px-[5%]">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-sm text-white/70 m-0">
          © {new Date().getFullYear()} Local Kitchen PH. All Rights Reserved.
        </p>

        <div className="flex items-center gap-1 text-sm text-white/50">
          <span>Made with</span>
          <Heart size={14} className="text-primary fill-primary mx-1" />
          <span>in Muntinlupa</span>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="https://www.facebook.com/localkitchenph"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-primary transition-colors duration-300"
            aria-label="Facebook"
          >
            <Facebook size={20} />
          </Link>
          <Link
            href="https://www.instagram.com/localkitchenph"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-primary transition-colors duration-300"
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
