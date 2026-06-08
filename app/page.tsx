'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const specialtyCakes = [
  {
    name: 'Carrot Walnut Cake',
    price: 950,
    image: '/images/carrot_cake.jpg',
    desc: 'Premium Carrot Cake with smooth cream cheese frosting, topped with handcrafted carrot toppers and a walnut crumble border.',
  },
  {
    name: 'Mango Cream Chiffon',
    price: 950,
    image: '/images/mango_chiffon.jpg',
    desc: 'Fluffy chiffon cake topped with fresh mango cubes, creamy white swirls, and a rich chocolate drizzle.',
  },
  {
    name: "S'mores Specialty Cake",
    price: 950,
    image: '/images/smores_cake.jpg',
    desc: 'Indulgent chocolate cake crowned with toasted marshmallows, premium chocolate bars, and crisp graham crackers.',
  },
  {
    name: 'Ube Macapuno Cake',
    price: 950,
    image: '/images/ube_macapuno.jpg',
    desc: 'Authentic Ube cake with a vibrant purple crumb, topped with creamy macapuno strings and elegant ube whipped swirls.',
  },
  {
    name: 'Classic Chocolate Cake',
    price: 900,
    image: '/images/classic_chocolate.jpg',
    desc: 'Rich, moist chocolate cake with a signature ganache drip, topped with premium chocolate confections and gourmet sprinkles.',
  },
  {
    name: 'Red Velvet Cake',
    price: 900,
    image: '/images/red_velvet.jpg', // fallback or actual image if exists, we'll assume it exists or use a generic one if missing but it was in original
    desc: 'Elegant Red Velvet cake with a delicate cocoa flavor, beautifully finished with white cream cheese whipped swirls.',
  },
];

const cupcakes = [
  { name: 'Ube Macapuno Cupcakes', price: 550, desc: 'Classic ube cake topped with macapuno strings and ube frosting.' },
  { name: 'Mango Chocolate Cupcakes', price: 550, desc: 'Chocolate cupcake with fresh mango core and whipped frosting.' },
  { name: 'Red Velvet White Choco Cupcakes', price: 550, desc: 'Red velvet base with white chocolate chips and cream cheese frosting.' },
  { name: 'Carrot Walnut Cupcakes', price: 550, desc: 'Bite-sized version of our best-seller with walnuts and cream cheese.' },
  { name: "Chocolate S'mores Cupcakes", price: 550, desc: 'Chocolate cake with graham crust, topped with toasted marshmallows.' },
  { name: 'Classic Chocolate Cupcakes', price: 550, desc: 'Our rich, signature chocolate cupcake with velvety chocolate frosting.' },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const { addItem, openCart } = useCart();
  
  // No useSearchParams hook if we want to keep it simple, or we can use it to open cart
  // But useSearchParams requires Suspense boundary. Let's just handle it with useEffect on window.location
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('openCart=true')) {
      setTimeout(() => openCart(), 300);
    }
  }, [openCart]);

  const handleAddToCart = (name: string, price: number) => {
    addItem(name, price);
    openCart();
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center pt-[100px] pb-16 px-[5%] bg-gradient-to-br from-bg-light to-white">
        <div className="max-w-[1440px] mx-auto w-full flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
          
          <motion.div 
            className="flex-1 max-w-[600px] text-center lg:text-left z-10"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-secondary mb-6 tracking-tight"
            >
              Sweet Moments, <br/><span className="text-primary italic font-light">Handcrafted.</span>
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-text-muted mb-10 max-w-[500px] mx-auto lg:mx-0"
            >
              Local Kitchen PH specializes in the finest specialty cakes and premium cupcakes. Every creation is handcrafted with love for your special celebrations.
            </motion.p>
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <Link 
                href="#cakes" 
                className="w-full sm:w-auto px-8 py-4 bg-primary text-secondary font-bold uppercase tracking-wide rounded-xl hover:bg-secondary hover:text-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-center flex items-center justify-center gap-2"
              >
                Explore Collection <ChevronRight size={18} />
              </Link>
              <Link 
                href="#story" 
                className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-secondary text-secondary font-bold uppercase tracking-wide rounded-xl hover:bg-secondary hover:text-primary transition-all duration-300 text-center"
              >
                Our Story
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            className="flex-1 w-full max-w-[600px] lg:max-w-none relative"
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-black/10">
              <Image 
                src="/images/specialty_hero.png" 
                alt="Specialty Cakes and Cupcakes by Local Kitchen PH" 
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </motion.div>
          
        </div>
      </section>

      {/* Specialty Cakes Section */}
      <section id="cakes" className="py-24 px-[5%] bg-white">
        <div className="max-w-[1200px] mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-secondary mb-4">Specialty Cakes</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {specialtyCakes.map((cake) => (
              <motion.div 
                key={cake.name}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-black/5 hover:border-primary/30 overflow-hidden transition-all duration-300 flex flex-col h-full z-10"
              >
                {/* Image logic - fallback to generic if not exist, assuming paths are correct */}
                <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
                  <Image 
                    src={cake.image} 
                    alt={cake.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-6 flex flex-col flex-1 bg-white relative z-20">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl text-secondary font-bold leading-tight group-hover:text-primary transition-colors">{cake.name}</h3>
                    <span className="bg-primary text-secondary px-3 py-1 text-xs font-black rounded-md shrink-0 ml-3">₱{cake.price}</span>
                  </div>
                  <p className="text-text-muted text-sm mb-6 flex-1">{cake.desc}</p>
                  
                  <button 
                    onClick={() => handleAddToCart(cake.name, cake.price)}
                    className="w-full py-3.5 bg-bg-light text-secondary font-bold uppercase tracking-wider text-sm rounded-xl hover:bg-primary transition-colors duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Cupcakes Section */}
      <section id="cupcakes" className="py-24 px-[5%] bg-bg-light">
        <div className="max-w-[1200px] mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-secondary mb-4">Handcrafted Cupcakes</h2>
            <p className="text-text-muted max-w-2xl mx-auto mb-6">Our premium cupcakes are handcrafted with the same dedication and quality as our signature cakes, offering the perfect bite-sized indulgence for any occasion.</p>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {cupcakes.map((cupcake) => (
              <motion.div 
                key={cupcake.name}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg text-secondary font-bold leading-tight">{cupcake.name}</h3>
                  <span className="bg-primary/20 text-primary-dark px-2.5 py-0.5 text-xs font-black rounded shrink-0 ml-3">₱{cupcake.price}</span>
                </div>
                <p className="text-text-muted text-sm mb-6 flex-1">{cupcake.desc}</p>
                
                <button 
                  onClick={() => handleAddToCart(cupcake.name, cupcake.price)}
                  className="w-full py-2.5 bg-transparent border-2 border-primary text-secondary font-bold uppercase tracking-wider text-xs rounded-lg hover:bg-primary transition-colors duration-300"
                >
                  Add to Cart
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="py-24 px-[5%] bg-secondary text-white relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-[800px] mx-auto text-center relative z-10"
        >
          <h2 className="text-4xl md:text-5xl text-primary mb-10 inline-block border-b-2 border-white/20 pb-4">Our Story</h2>
          <p className="text-lg md:text-xl leading-relaxed mb-6 font-light text-white/90">
            Local Kitchen PH started with a simple passion: bringing the warmth and quality of a handcrafted sweet treat to your celebrations. What began as a small family kitchen in Muntinlupa has grown into a specialized source for premium cakes and cupcakes loved across the Philippines.
          </p>
          <p className="text-lg md:text-xl leading-relaxed font-light text-white/90">
            Every cake we frost and every cupcake we prepare is a testament to our commitment to quality, taste, and the joy of sharing something sweet with the people you love.
          </p>
        </motion.div>
      </section>

      {/* Personalized CTA Section */}
      <section className="py-32 px-[5%] bg-bg-light text-center relative overflow-hidden">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-[800px] mx-auto relative z-10"
        >
          <Sparkles className="mx-auto text-primary mb-6" size={48} strokeWidth={1.5} />
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-secondary mb-6">Your Vision, Our Creation</h2>
          <p className="text-xl text-text-muted mb-12">Dreaming of something truly unique? We love bringing special ideas to life.</p>
          
          <Link 
            href="/personalized-cake"
            className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-lg text-white bg-gradient-to-r from-primary to-primary-dark rounded-full overflow-hidden shadow-[0_15px_35px_rgba(212,160,23,0.3)] hover:shadow-[0_20px_45px_rgba(212,160,23,0.5)] hover:-translate-y-1 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              Design Your Custom Cake <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
          </Link>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-[5%] bg-white text-center">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-[800px] mx-auto"
        >
          <h2 className="text-4xl md:text-5xl text-secondary mb-4">Get in Touch</h2>
          <p className="text-lg text-text-muted mb-12">Have questions or want to inquire about a custom design? We're here to help.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a 
              href="https://m.me/localkitchenph" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-8 py-4 bg-[#0084FF] text-white font-bold rounded-xl hover:bg-[#0073e6] transition-colors shadow-lg shadow-blue-500/20"
            >
              Message on Messenger
            </a>
            <a 
              href="tel:09202929032" 
              className="flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-secondary text-secondary font-bold rounded-xl hover:bg-secondary hover:text-white transition-all shadow-sm"
            >
              Call: 0920 2929 032
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
