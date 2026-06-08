'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';

export default function Payment() {
  const router = useRouter();
  const { clear } = useCart();
  const [mounted, setMounted] = useState(false);
  const [orderState, setOrderState] = useState<any>(null);

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [phone, setPhone] = useState('+63 ');
  const [phoneError, setPhoneError] = useState(false);
  
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('gcash');

  const [minDate, setMinDate] = useState('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('localKitchenOrderState');
    if (!saved) {
      router.push('/checkout');
      return;
    }
    const parsed = JSON.parse(saved);
    setOrderState(parsed);

    // Date logic
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    
    // Check if personalized cake
    const hasCustomCake = parsed.items?.some((item: any) => item.name.startsWith('Personalized Cake:'));
    let minD = new Date(today.getTime() - offset);
    
    if (hasCustomCake) {
      minD = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000) - offset);
    }
    
    const minDateStr = minD.toISOString().split('T')[0];
    setMinDate(minDateStr);
    setPickupDate(minDateStr);
    
    updateTimeSlots(minDateStr);
  }, [router]);

  const updateTimeSlots = (selectedDate: string) => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(today.getTime() - offset)).toISOString().split('T')[0];
    
    const allTimes = [
      "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", 
      "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", 
      "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", 
      "16:00", "16:30", "17:00", "17:30", "18:00"
    ];

    if (selectedDate === localISOTime) {
      const leadTimeLimit = new Date(today.getTime() + (2 * 60 * 60 * 1000));
      const leadTimeStr = leadTimeLimit.getHours().toString().padStart(2, '0') + ':' + 
                          leadTimeLimit.getMinutes().toString().padStart(2, '0');
      
      const filtered = allTimes.filter(t => t >= leadTimeStr);
      setAvailableTimes(filtered);
      if (!filtered.includes(pickupTime)) setPickupTime('');
    } else {
      setAvailableTimes(allTimes);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = e.target.value;
    setPickupDate(d);
    updateTimeSlots(d);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanValue = value.replace(/[^a-zA-Z\s]/g, '');
    if (value !== cleanValue) {
      setNameError(true);
    } else {
      setNameError(false);
    }
    setName(cleanValue);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith('+63 ')) {
      value = '+63 ' + value.replace(/^\+63\s?/, '').replace(/\D/g, '');
    }
    let digits = value.substring(4).replace(/\D/g, '');
    let formatted = '+63 ';
    if (digits.length > 0) {
      formatted += digits.substring(0, 3);
      if (digits.length > 3) {
        formatted += ' ' + digits.substring(3, 6);
        if (digits.length > 6) {
          formatted += ' ' + digits.substring(6, 10);
        }
      }
    }
    setPhone(formatted);
    setPhoneError(digits.length > 0 && digits.length < 10);
  };

  const generateInvoice = (order: any) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: [576, 288]
    });

    doc.setFillColor(250, 249, 244);
    doc.rect(0, 0, 576, 288, 'F');
    doc.setDrawColor(224, 187, 108);
    doc.setLineWidth(15);
    doc.line(0, 7.5, 576, 7.5);

    doc.setTextColor(51, 51, 51);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('LOCAL KITCHEN PH', 40, 45);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(102, 102, 102);
    doc.text('PREMIUM SPECIALTY CAKES & CUPCAKES', 40, 60);

    doc.setDrawColor(224, 187, 108);
    doc.setLineWidth(1);
    doc.line(40, 70, 536, 70);

    doc.setTextColor(51, 51, 51);
    doc.setFont('helvetica', 'bold');
    doc.text('CUSTOMER DETAILS', 40, 90);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Name: ${order.customer.name}`, 40, 105);
    doc.text(`Phone: ${order.customer.phone}`, 40, 118);
    doc.text(`Method: ${order.customer.deliveryMethod.toUpperCase()}`, 40, 131);
    doc.text(`Schedule: ${order.customer.pickupDate || 'N/A'} @ ${order.customer.pickupTime || 'N/A'}`, 40, 144);

    if (order.customer.deliveryMethod === 'courier') {
      doc.setFont('helvetica', 'bold');
      doc.text('PICK-UP FOR COURIER:', 40, 165);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Address: 217 Pleasant Drive, Bayanan, Muntinlupa', 40, 178);
      doc.text('Contact: Joanne Cruz (09202929032)', 40, 188);
      doc.setFontSize(9);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('ORDER SUMMARY', 200, 90);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    let y = 105;
    order.items.forEach((item: any) => {
      if (y > 210) return;
      const line = `${item.quantity}x ${item.name}`;
      const splitLine = doc.splitTextToSize(line, 200);
      doc.text(splitLine, 200, y);
      y += (splitLine.length * 12);
    });

    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT DETAILS', 420, 90);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(order.customer.paymentMethod.toUpperCase(), 420, 105);
    
    doc.setDrawColor(200, 200, 200);
    doc.rect(420, 115, 80, 80);
    doc.setFontSize(7);
    doc.text(`SCAN FOR ${order.customer.paymentMethod.toUpperCase()}`, 425, 155);
    doc.setFontSize(9);

    const totalY = 240;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    const subtotal = order.subtotal;
    const total = subtotal - (order.discount || 0);
    
    doc.text(`Subtotal: P${subtotal.toLocaleString()}`, 420, totalY);
    if (order.discount > 0) {
      doc.setTextColor(211, 47, 47);
      doc.text(`Discount: -P${order.discount.toLocaleString()}`, 420, totalY + 15);
      doc.setTextColor(51, 51, 51);
    }
    doc.setFontSize(14);
    doc.setTextColor(194, 153, 67);
    doc.text(`TOTAL: P${total.toLocaleString()}`, 420, totalY + 35);

    doc.setTextColor(102, 102, 102);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for choosing Local Kitchen PH! Please send your proof of payment via IG/FB.', 40, 270);

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const phoneDigits = phone.substring(4).replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      alert('Please enter a complete 10-digit mobile number.');
      return;
    }

    const finalOrder = {
      ...orderState,
      customer: {
        name,
        phone,
        deliveryMethod,
        pickupDate: deliveryMethod === 'pickup' ? pickupDate : null,
        pickupTime: deliveryMethod === 'pickup' ? pickupTime : null,
        paymentMethod
      }
    };

    generateInvoice(finalOrder);

    alert(`Order Placed! Thank you, ${name}. Your invoice has been downloaded. We will contact you at ${phone} for any further details.`);
    
    clear();
    localStorage.removeItem('localKitchenOrderState');
    router.push('/');
  };

  if (!mounted || !orderState) return null;

  return (
    <main className="pt-[100px] pb-16 px-[5%] bg-bg-light min-h-screen">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-10 items-start">
        
        {/* Summary Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 lg:sticky lg:top-[100px]"
        >
          <h2 className="text-xl text-secondary mb-6 font-heading font-bold">Order Summary</h2>
          <div className="space-y-3 mb-6">
            {orderState.items.map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-secondary">{item.name} <span className="text-text-muted">x{item.quantity}</span></span>
                <span className="font-semibold text-secondary">₱{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            
            {(orderState.addons.classic_pink > 0 || orderState.addons.classic_blue > 0) && (
              <div className="text-xs text-text-muted mt-2">• Classic Candles: {orderState.addons.classic_pink}P, {orderState.addons.classic_blue}B</div>
            )}
            {orderState.addons.number_candles?.length > 0 && (
              <div className="text-xs text-text-muted">• Number Candles: {orderState.addons.number_candles.join(', ')}</div>
            )}
            {orderState.addons.toppers?.length > 0 && (
              <div className="text-xs text-text-muted">• Toppers: {orderState.addons.toppers.join(', ')}</div>
            )}

            {orderState.discount > 0 && (
              <div className="flex justify-between pt-3 mt-3 border-t border-dashed border-gray-200 text-green-600 font-semibold text-sm">
                <span>Coupon Discount</span>
                <span>-₱{orderState.discount.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="border-t-2 border-primary/30 pt-4">
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-text-muted">Subtotal</span>
              <span className="font-semibold text-secondary">₱{orderState.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-2xl font-black text-secondary mt-2">
              <span>Total</span>
              <span>₱{(orderState.subtotal - (orderState.discount || 0)).toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Details Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100"
        >
          <form onSubmit={handleSubmit}>
            
            <h3 className="text-lg uppercase tracking-wider font-bold text-secondary mb-6 pb-2 border-b-2 border-primary inline-block">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={handleNameChange}
                  required 
                  placeholder="Enter your name (Letters only)" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
                {nameError && <p className="text-red-500 text-xs mt-1 font-medium">Only letters and spaces are allowed.</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={handlePhoneChange}
                  onKeyDown={(e) => {
                    if ((e.target as HTMLInputElement).selectionStart! < 4 && (e.key === 'Backspace' || e.key === 'Delete')) {
                      e.preventDefault();
                    }
                  }}
                  required 
                  placeholder="+63 9XX XXX XXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
                {phoneError && <p className="text-red-500 text-xs mt-1 font-medium">Please enter a complete 10-digit mobile number.</p>}
              </div>
            </div>

            <h3 className="text-lg uppercase tracking-wider font-bold text-secondary mb-6 pb-2 border-b-2 border-primary inline-block">Collection Method</h3>
            <div className="mb-10 space-y-4">
              <label className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${deliveryMethod === 'pickup' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                <input 
                  type="radio" 
                  name="deliveryMethod" 
                  value="pickup" 
                  checked={deliveryMethod === 'pickup'}
                  onChange={() => setDeliveryMethod('pickup')}
                  className="w-5 h-5 accent-primary"
                />
                <div>
                  <strong className="block text-secondary">Customer Pick-up</strong>
                  <span className="text-sm text-text-muted">Pick up at our Muntinlupa location</span>
                </div>
              </label>

              <AnimatePresence>
                {deliveryMethod === 'pickup' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-text-muted mb-1 uppercase tracking-wide">Pick-up Date</label>
                        <input 
                          type="date" 
                          min={minDate}
                          value={pickupDate}
                          onChange={handleDateChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-muted mb-1 uppercase tracking-wide">Pick-up Time</label>
                        <select 
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-primary bg-white"
                        >
                          <option value="" disabled>Select time</option>
                          {availableTimes.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <span className="text-[10px] text-text-muted mt-1 block">Business hours: 7AM - 6PM</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <label className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${deliveryMethod === 'courier' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                <input 
                  type="radio" 
                  name="deliveryMethod" 
                  value="courier" 
                  checked={deliveryMethod === 'courier'}
                  onChange={() => setDeliveryMethod('courier')}
                  className="w-5 h-5 accent-primary"
                />
                <div>
                  <strong className="block text-secondary">Courier Services (Lalamove/Grab)</strong>
                  <span className="text-sm text-text-muted">Customer handles booking & courier fee</span>
                </div>
              </label>
            </div>

            <h3 className="text-lg uppercase tracking-wider font-bold text-secondary mb-6 pb-2 border-b-2 border-primary inline-block">Payment Method</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {['gcash', 'maya', 'bank'].map((method) => (
                <label key={method} className="relative cursor-pointer group">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value={method} 
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="absolute opacity-0"
                  />
                  <div className={`p-4 text-center border-2 rounded-xl transition-all ${paymentMethod === method ? 'border-blue-500 bg-blue-50' : 'border-gray-200 group-hover:border-gray-300 bg-white'}`}>
                    <div className={`w-5 h-5 mx-auto mb-2 rounded-full border-2 flex items-center justify-center ${paymentMethod === method ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                      {paymentMethod === method && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <span className="font-bold text-secondary">{method === 'bank' ? 'Bank Transfer' : method.charAt(0).toUpperCase() + method.slice(1)}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="space-y-4">
              <button 
                type="submit" 
                className="w-full py-4 bg-primary text-secondary font-bold uppercase tracking-wider rounded-xl hover:bg-secondary hover:text-primary transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 text-lg"
              >
                Confirm Order Request
              </button>
              
              <div className="flex justify-between items-center px-2">
                <Link href="/checkout" className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm font-semibold uppercase tracking-wider">
                  <ArrowLeft size={16} /> Back to Customization
                </Link>
                <Link href="/?openCart=true#cakes" className="text-primary hover:text-primary-dark transition-colors text-sm font-bold underline">
                  Add more items
                </Link>
              </div>
            </div>

          </form>
        </motion.div>
      </div>
    </main>
  );
}
