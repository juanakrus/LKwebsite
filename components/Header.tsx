'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { href: '/#hero', label: 'Home' },
  { href: '/#cakes', label: 'Cakes' },
  { href: '/#cupcakes', label: 'Cupcakes' },
  { href: '/personalized-cake', label: 'Personalized Cake' },
  { href: '/#contact', label: 'Contact' },
];

export default function Header() {
  const { totalItems, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'h-[70px] bg-white/95 backdrop-blur-xl shadow-sm border-b border-black/5'
          : 'h-20 bg-white/98 backdrop-blur-md border-b border-black/[0.03]'
      }`}
    >
      <div className="flex items-center justify-between h-full px-[5%] max-w-[1440px] mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <div className="relative h-11 w-11 rounded-full border-2 border-primary overflow-hidden transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/images/logo.png"
              alt="Local Kitchen PH Logo"
              fill
              className="object-cover"
              sizes="44px"
              priority
            />
          </div>
          <span className="font-heading text-xl font-bold text-primary tracking-tight hidden sm:block">
            LOCAL KITCHEN PH
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-secondary font-semibold text-[0.8rem] uppercase tracking-wider hover:text-primary-dark transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={openCart}
            className="flex items-center gap-2 bg-primary text-secondary px-5 py-2.5 rounded-lg font-bold text-[0.8rem] uppercase tracking-wider hover:bg-secondary hover:text-primary transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
          >
            <ShoppingCart size={16} strokeWidth={2.5} />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="bg-secondary text-primary text-[0.65rem] px-1.5 py-0.5 rounded-full min-w-[20px] text-center font-bold leading-tight">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex flex-col gap-1.5 p-2 cursor-pointer bg-transparent border-none z-[1001]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X size={24} className="text-secondary" />
            ) : (
              <Menu size={24} className="text-secondary" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[998] lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-[280px] h-full bg-white z-[999] shadow-2xl p-10 pt-24 lg:hidden"
            >
              <ul className="flex flex-col gap-6 list-none p-0 m-0">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-secondary font-semibold text-base uppercase tracking-wider hover:text-primary-dark transition-colors duration-300 no-underline"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
