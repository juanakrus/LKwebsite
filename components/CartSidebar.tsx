'use client';

import { Plus, Minus, Trash2, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CartSidebar() {
  const { items, updateQuantity, removeItem, clear, isOpen, closeCart, totalPrice } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    if (items.length > 0) {
      closeCart();
      router.push('/checkout');
    } else {
      alert('Your cart is empty!');
    }
  };

  const handleEmpty = () => {
    if (items.length > 0 && confirm('Are you sure you want to empty your cart?')) {
      clear();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-[4px] z-[1999] cursor-pointer"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] z-[2000] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b-2 border-primary">
              <h2 className="font-heading text-xl font-bold text-secondary">Your Order</h2>
              <button
                onClick={closeCart}
                className="p-1.5 hover:bg-bg-light rounded-full transition-colors duration-200 cursor-pointer bg-transparent border-none"
                aria-label="Close cart"
              >
                <X size={20} className="text-text-muted" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-text-muted">
                  <ShoppingBag size={48} strokeWidth={1.5} className="mb-4 opacity-30" />
                  <p className="text-sm">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(item => (
                    <motion.div
                      key={item.name}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex items-center justify-between pb-4 border-b border-gray-100"
                    >
                      <div className="flex-1 min-w-0 mr-3">
                        <h4 className="text-sm font-semibold text-secondary truncate m-0">
                          {item.name}
                        </h4>
                        <p className="text-primary font-semibold text-sm mt-1 m-0">
                          {item.price > 0 ? `₱${item.price.toLocaleString()}` : 'Price TBD'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center gap-1.5 bg-bg-light rounded-full px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.name, -1)}
                            className="p-0.5 hover:text-primary transition-colors cursor-pointer bg-transparent border-none"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm min-w-[20px] text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.name, 1)}
                            className="p-0.5 hover:text-primary transition-colors cursor-pointer bg-transparent border-none"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.name)}
                          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all cursor-pointer bg-transparent border-none"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 pt-4 border-t-2 border-secondary">
              {items.length > 0 && (
                <button
                  onClick={handleEmpty}
                  className="w-full py-2.5 bg-transparent border border-red-400 text-red-400 rounded-lg text-xs font-medium cursor-pointer hover:bg-red-50 transition-colors mb-3"
                >
                  Empty Cart
                </button>
              )}
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-heading text-lg font-bold">Total</h3>
                <span className="font-heading text-lg font-bold text-primary">
                  ₱{totalPrice.toLocaleString()}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-primary text-secondary font-bold text-sm uppercase tracking-wider rounded-lg cursor-pointer hover:bg-secondary hover:text-primary transition-all duration-300 border-none"
              >
                Review Order & Checkout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
