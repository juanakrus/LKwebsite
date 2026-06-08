'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Checkout() {
  const router = useRouter();
  const { items, totalPrice } = useCart();
  
  const [mounted, setMounted] = useState(false);
  const [classicPink, setClassicPink] = useState(0);
  const [classicBlue, setClassicBlue] = useState(0);
  const [numberCandles, setNumberCandles] = useState<number[]>([]);
  const [toppers, setToppers] = useState<string[]>([]);
  const [details, setDetails] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState('');
  
  const [topperDropdownOpen, setTopperDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (items.length === 0) {
      localStorage.removeItem('localKitchenTempAddons');
      router.push('/');
      return;
    }

    const saved = localStorage.getItem('localKitchenTempAddons');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setClassicPink(parseInt(parsed.pinkCount) || 0);
        setClassicBlue(parseInt(parsed.blueCount) || 0);
        setNumberCandles(parsed.selectedNumbers ? parsed.selectedNumbers.map(Number) : []);
        setToppers(parsed.selectedToppers || []);
        setDetails(parsed.details || '');
        setCouponCode(parsed.coupon || '');
        setIsCouponApplied(parsed.isCouponApplied || false);
      } catch (e) {
        console.error('Failed to parse saved addons', e);
      }
    }
  }, [items.length, router]);

  // Calculations
  const totalCakes = items.reduce((sum, item) => sum + (item.name.toLowerCase().includes('cupcake') ? 0 : item.quantity), 0);
  const totalClassic = classicPink + classicBlue;
  const freeClassic = Math.min(totalClassic, totalCakes);
  const paidClassic = Math.max(0, totalClassic - totalCakes);

  const addonTotal = (paidClassic * 10) + (numberCandles.length * 30) + (toppers.length * 50);
  const rawTotal = totalPrice + addonTotal;
  
  let currentDiscount = 0;
  if (isCouponApplied && rawTotal >= 3000) {
    currentDiscount = rawTotal * 0.05;
  }

  const finalTotal = rawTotal - currentDiscount;

  useEffect(() => {
    if (mounted) {
      const tempAddons = {
        pinkCount: classicPink,
        blueCount: classicBlue,
        selectedNumbers: numberCandles,
        selectedToppers: toppers,
        details,
        coupon: couponCode,
        isCouponApplied
      };
      localStorage.setItem('localKitchenTempAddons', JSON.stringify(tempAddons));
    }
  }, [classicPink, classicBlue, numberCandles, toppers, details, couponCode, isCouponApplied, mounted]);

  const toggleNumberCandle = (num: number) => {
    setNumberCandles(prev => 
      prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]
    );
  };

  const toggleTopper = (topper: string) => {
    setToppers(prev => 
      prev.includes(topper) ? prev.filter(t => t !== topper) : [...prev, topper]
    );
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'LKWEB') {
      if (rawTotal >= 3000) {
        setIsCouponApplied(true);
        setCouponMessage('');
      } else {
        setIsCouponApplied(false);
        setCouponMessage('Minimum spend of ₱3,000 required.');
      }
    } else if (code === '') {
      setIsCouponApplied(false);
      setCouponMessage('');
    } else {
      setIsCouponApplied(false);
      setCouponMessage('Invalid coupon code.');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const orderState = {
      items,
      addons: {
        classic_pink: classicPink,
        classic_blue: classicBlue,
        number_candles: numberCandles,
        toppers,
        special_requests: details,
        coupon: isCouponApplied ? couponCode : ''
      },
      subtotal: rawTotal,
      discount: currentDiscount
    };

    localStorage.setItem('localKitchenOrderState', JSON.stringify(orderState));
    router.push('/payment');
  };

  if (!mounted || items.length === 0) return null;

  return (
    <main className="pt-[100px] pb-16 px-[5%] bg-bg-light min-h-screen">
      <div className="max-w-[1000px] mx-auto mb-6">
        <Link 
          href="/?openCart=true#cakes" 
          className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm font-semibold uppercase tracking-wider"
        >
          <ArrowLeft size={18} /> Back to Menu
        </Link>
      </div>
      
      <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* Order Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
        >
          <h2 className="text-2xl text-secondary mb-6">Order Summary</h2>
          
          <div className="mb-6 space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between pb-3 border-b border-gray-50">
                <div>
                  <h4 className="font-semibold text-secondary text-sm">{item.name}</h4>
                  <p className="text-xs text-text-muted mt-1">{item.price > 0 ? `₱${item.price.toLocaleString()} x ${item.quantity}` : 'Price TBD'}</p>
                </div>
                <strong className="text-primary text-sm">{item.price > 0 ? `₱${(item.price * item.quantity).toLocaleString()}` : 'Quote Pending'}</strong>
              </div>
            ))}

            {freeClassic > 0 && (
              <div className="flex justify-between pb-2 border-b border-gray-50 border-dashed text-sm">
                <span className="text-text-muted">Classic Candle ({freeClassic}x Free)</span>
                <strong className="text-secondary">Free</strong>
              </div>
            )}
            {paidClassic > 0 && (
              <div className="flex justify-between pb-2 border-b border-gray-50 border-dashed text-sm">
                <span className="text-text-muted">Classic Candle ({paidClassic}x Extra)</span>
                <strong className="text-secondary">₱{paidClassic * 10}</strong>
              </div>
            )}
            
            {numberCandles.map(num => (
              <div key={`num-${num}`} className="flex justify-between pb-2 border-b border-gray-50 border-dashed text-sm">
                <span className="text-text-muted">Number Candle ({num})</span>
                <strong className="text-secondary">₱30</strong>
              </div>
            ))}
            
            {toppers.map(topper => (
              <div key={topper} className="flex justify-between pb-2 border-b border-gray-50 border-dashed text-sm">
                <span className="text-text-muted">Acrylic Topper ({topper})</span>
                <strong className="text-secondary">₱50</strong>
              </div>
            ))}

            {isCouponApplied && currentDiscount > 0 && (
              <div className="flex justify-between pt-2 text-green-600 text-sm font-semibold border-t border-gray-100">
                <span>Discount (5% off)</span>
                <span>-₱{currentDiscount.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="border-t-2 border-secondary pt-4 mb-6">
            <h3 className="flex justify-between text-xl text-secondary">
              Total <span className="text-primary">₱{finalTotal.toLocaleString()}</span>
            </h3>
          </div>

          <div className="pt-4 border-t border-gray-100">
            {!isCouponApplied ? (
              <>
                <label htmlFor="coupon" className="block text-sm font-semibold text-text-muted mb-2 uppercase tracking-wide">Have a Coupon Code?</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    id="coupon" 
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponMessage('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                    placeholder="Enter code" 
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  />
                  <button 
                    type="button" 
                    onClick={applyCoupon}
                    className="px-6 py-2 bg-transparent border-2 border-secondary text-secondary font-bold text-xs uppercase tracking-wide rounded-lg hover:bg-secondary hover:text-white transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className="text-red-500 text-xs font-semibold mt-2">{couponMessage}</p>
                )}
              </>
            ) : (
              <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-100">
                <span className="text-green-600 text-sm font-bold">LKWEB applied: 5% off!</span>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsCouponApplied(false);
                    setCouponCode('');
                  }}
                  className="text-red-500 text-xs underline hover:text-red-700 font-semibold"
                >
                  Remove
                </button>
              </div>
            )}
            
            <Link href="/?openCart=true#cakes" className="block text-center text-text-muted hover:text-primary text-xs font-semibold uppercase tracking-wide underline mt-6 transition-colors">
              + Add more items to cart
            </Link>
          </div>
        </motion.div>

        {/* Customization Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl text-secondary mb-6">Customization & Add-ons</h2>
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            
            <div className="mb-8">
              <label className="block text-sm font-bold uppercase tracking-wide text-secondary mb-4">Complimentary Add-ons</label>
              
              <div className="mb-6 p-4 bg-bg-light rounded-xl border border-gray-100">
                <span className="text-sm text-text-muted block mb-3 font-medium">Classic Candle (1 Free per Cake, ₱10 for extras)</span>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                    Pink 
                    <input 
                      type="number" 
                      min="0" max="10" 
                      value={classicPink}
                      onChange={(e) => setClassicPink(parseInt(e.target.value) || 0)}
                      className="w-14 px-2 py-1 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                    Blue 
                    <input 
                      type="number" 
                      min="0" max="10" 
                      value={classicBlue}
                      onChange={(e) => setClassicBlue(parseInt(e.target.value) || 0)}
                      className="w-14 px-2 py-1 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-sm text-text-muted block mb-3 font-medium">Number Candles (₱30 each)</span>
                <div className="grid grid-cols-5 gap-3">
                  {[0,1,2,3,4,5,6,7,8,9].map(num => (
                    <label key={num} className={`flex items-center justify-center gap-2 p-2 border rounded-lg cursor-pointer transition-all ${numberCandles.includes(num) ? 'border-primary bg-primary/5 text-primary-dark font-bold' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={numberCandles.includes(num)}
                        onChange={() => toggleNumberCandle(num)}
                      /> 
                      {num}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6 relative">
                <span className="text-sm text-text-muted block mb-3 font-medium">Themed Acrylic Toppers (₱50 each)</span>
                <div className="relative">
                  <div 
                    onClick={() => setTopperDropdownOpen(!topperDropdownOpen)}
                    className={`min-h-[46px] p-3 border rounded-lg cursor-pointer bg-white flex justify-between items-center transition-colors ${toppers.length > 0 ? 'border-primary' : 'border-gray-300'}`}
                  >
                    <div className="flex flex-wrap gap-1">
                      {toppers.length > 0 ? (
                        toppers.map(t => (
                          <span key={t} className="bg-primary/15 text-primary-dark px-2 py-1 rounded text-xs font-bold">{t}</span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">Select Toppers...</span>
                      )}
                    </div>
                    <ChevronDown size={16} className="text-gray-400 ml-2 shrink-0" />
                  </div>
                  
                  <AnimatePresence>
                    {topperDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-[100%] mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden"
                      >
                        {['Birthday', 'Graduation', 'Anniversary', 'Christmas', 'New Year'].map(topper => (
                          <label 
                            key={topper} 
                            className={`flex items-center justify-between p-3 cursor-pointer text-sm transition-colors border-b last:border-b-0 border-gray-50 ${toppers.includes(topper) ? 'bg-primary/5 text-primary-dark font-bold' : 'hover:bg-gray-50'}`}
                          >
                            <input 
                              type="checkbox" 
                              className="hidden"
                              checked={toppers.includes(topper)}
                              onChange={() => toggleTopper(topper)}
                            /> 
                            {topper}
                            {toppers.includes(topper) && <span className="text-primary">✓</span>}
                          </label>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label htmlFor="details" className="block text-sm font-bold uppercase tracking-wide text-secondary mb-2">Personalization / Special Requests</label>
              <textarea 
                id="details" 
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3} 
                placeholder="Theme, dedication for cakes, or special instructions..."
                className="w-full p-4 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-y"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full py-4 bg-primary text-secondary font-bold uppercase tracking-wider rounded-xl hover:bg-secondary hover:text-primary transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1"
            >
              Proceed to Payment & Details
            </button>
          </form>
        </motion.div>

      </div>
    </main>
  );
}
