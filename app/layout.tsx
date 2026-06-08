import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import CartSidebar from '@/components/CartSidebar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Local Kitchen PH | Specialty Cakes & Cupcakes',
  description:
    'Local Kitchen PH specializes in handcrafted specialty cakes and premium cupcakes. Best sellers: Carrot Walnut, Mango Chiffon, and S\'mores Cake.',
  icons: {
    icon: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Header />
          <CartSidebar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
