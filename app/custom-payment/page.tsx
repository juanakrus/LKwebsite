'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function CustomPayment() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [customOrder, setCustomOrder] = useState<any>(null);

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
    const saved = localStorage.getItem('localKitchenCustomOrder');
    if (!saved) {
      router.push('/personalized-cake');
      return;
    }
    setCustomOrder(JSON.parse(saved));

    // Date logic (3 days lead time)
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    const customDate = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000) - offset);
    const minDateStr = customDate.toISOString().split('T')[0];
    
    setMinDate(minDateStr);
    setPickupDate(minDateStr);
    updateTimeSlots(minDateStr);
  }, [router]);

  const updateTimeSlots = (selectedDate: string) => {
    const allTimes = [
      "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", 
      "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", 
      "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", 
      "16:00", "16:30", "17:00", "17:30", "18:00"
    ];
    // Since custom cakes are always 3+ days out, all times are available
    setAvailableTimes(allTimes);
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
    doc.text('PREMIUM PERSONALIZED CAKE INQUIRY', 40, 60);

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
    doc.text('CAKE SPECIFICATIONS', 200, 90);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    doc.text(`Occasion: ${order.customDetails.occasion}`, 200, 105);
    doc.text(`Size: ${order.customDetails.size}`, 200, 118);
    doc.text(`Flavor: ${order.customDetails.flavor}`, 200, 131);
    doc.text(`Filling: ${order.customDetails.filling}`, 200, 144);
    
    if (order.customDetails.requests) {
      const req = `Requests: ${order.customDetails.requests}`;
      const splitReq = doc.splitTextToSize(req, 200);
      doc.text(splitReq, 200, 160);
    }

    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT DETAILS', 420, 90);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('GCash: 0920 2929 032', 420, 105);
    doc.text('Maya: 0920 2929 032', 420, 115);
    
    doc.setDrawColor(200, 200, 200);
    doc.rect(420, 125, 80, 80);
    doc.setFontSize(7);
    doc.text('SCAN QR CODE', 432, 165);
    doc.text('TO PAY', 448, 175);
    doc.setFontSize(9);

    const totalY = 240;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(194, 153, 67);
    doc.text(`STARTING PRICE: P${order.customDetails.price.toLocaleString()}`, 350, totalY + 35);

    doc.setTextColor(102, 102, 102);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for your inquiry! We will contact you shortly to finalize details.', 40, 270);

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
      customDetails: customOrder,
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

    alert(`Inquiry Sent! Thank you, ${name}. Your invoice has been downloaded. We will contact you at ${phone} to finalize the design and provide a formal quote.`);
    
    localStorage.removeItem('localKitchenCustomOrder');
    router.push('/');
  };

  if (!mounted || !customOrder) return null;

  return (
    <main className="pt-[100px] pb-16 px-[5%] bg-bg-light min-h-screen">
      <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-10 items-start">
        
        {/* Summary Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 lg:sticky lg:top-[100px]"
        >
          <h2 className="text-xl text-secondary mb-6 font-heading font-bold">Custom Order Summary</h2>
          <div className="space-y-2 mb-6 text-sm">
            <h3 className="font-bold text-secondary text-base mb-3">Personalized Cake: {customOrder.occasion}</h3>
            <p className="text-text-muted"><strong className="text-secondary">Size:</strong> {customOrder.size}</p>
            <p className="text-text-muted"><strong className="text-secondary">Flavor:</strong> {customOrder.flavor}</p>
            <p className="text-text-muted"><strong className="text-secondary">Filling:</strong> {customOrder.filling}</p>
            {customOrder.requests && <p className="text-text-muted mt-3"><strong className="text-secondary block mb-1">Requests:</strong> {customOrder.requests}</p>}
            {customOrder.ref_link && (
              <p className="text-text-muted mt-3">
                <strong className="text-secondary">Ref Link:</strong>{' '}
                <a href={customOrder.ref_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View Design</a>
              </p>
            )}
          </div>

          <div className="border-t-2 border-primary/30 pt-4">
            <div className="flex justify-between items-end text-2xl font-black text-secondary">
              <span className="text-lg">Total</span>
              <span>₱{customOrder.price.toLocaleString()}</span>
            </div>
            <small className="block text-text-muted text-xs mt-2">* Starting price. Final quote may vary based on design complexity.</small>
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
                          onChange={(e) => setPickupDate(e.target.value)}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-primary"
                        />
                        <span className="text-[10px] text-text-muted mt-1 block">Lead time: 3 days minimum</span>
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

            <button 
              type="submit" 
              className="w-full py-4 bg-primary text-secondary font-bold uppercase tracking-wider rounded-xl hover:bg-secondary hover:text-primary transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 text-lg"
            >
              Confirm Inquiry Request
            </button>
            
          </form>
        </motion.div>
      </div>
    </main>
  );
}
