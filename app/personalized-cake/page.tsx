'use client';

import { useState, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Upload, Link as LinkIcon, Sparkles } from 'lucide-react';

export default function PersonalizedCake() {
  const router = useRouter();
  
  const [occasion, setOccasion] = useState('');
  const [occasionSpecify, setOccasionSpecify] = useState('');
  const [flavor, setFlavor] = useState('');
  const [size, setSize] = useState('6-inch');
  const [filling, setFilling] = useState('');
  const [requests, setRequests] = useState('');
  const [refLink, setRefLink] = useState('');
  const [fileName, setFileName] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    let finalOccasion = occasion;
    if (occasion === 'Others') {
      finalOccasion = occasionSpecify;
    }
    
    let price = 0;
    if (size === '6-inch') price = 1500;
    else if (size === '8-inch') price = 2000;
    else if (size === '10-inch') price = 2500;

    const customData = {
      occasion: finalOccasion,
      size,
      flavor,
      filling,
      requests,
      ref_link: refLink,
      price
    };
    
    localStorage.setItem('localKitchenCustomOrder', JSON.stringify(customData));
    router.push('/custom-payment');
  };

  return (
    <main className="pt-[120px] pb-24 px-[5%] bg-bg-light min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[800px] mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border-t-[8px] border-primary"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Sparkles className="text-primary" size={32} />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl text-secondary mb-3">Make Your Dream Cake</h1>
          <p className="text-text-muted text-lg">Fill out the details below and we'll create a masterpiece just for you.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold text-sm uppercase tracking-wide text-secondary mb-2">Occasion</label>
              <select 
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
              >
                <option value="" disabled>Select an occasion</option>
                <option value="Birthday">Birthday</option>
                <option value="Wedding">Wedding</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Graduation">Graduation</option>
                <option value="Christmas">Christmas</option>
                <option value="New Year">New Year</option>
                <option value="Others">Others</option>
              </select>
              
              {occasion === 'Others' && (
                <motion.input 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  type="text" 
                  value={occasionSpecify}
                  onChange={(e) => setOccasionSpecify(e.target.value)}
                  placeholder="Please specify occasion" 
                  required
                  className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-xl focus:border-primary outline-none bg-gray-50"
                />
              )}
            </div>
            
            <div>
              <label className="block font-bold text-sm uppercase tracking-wide text-secondary mb-2">Base Flavor</label>
              <select 
                value={flavor}
                onChange={(e) => setFlavor(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
              >
                <option value="" disabled>Select base flavor</option>
                <option value="Chocolate">Chocolate</option>
                <option value="Vanilla">Vanilla</option>
                <option value="Mango">Mango</option>
                <option value="Strawberry">Strawberry</option>
                <option value="Mocha">Mocha</option>
                <option value="Coffee">Coffee</option>
                <option value="Red Velvet">Red Velvet</option>
                <option value="Matcha">Matcha</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-sm uppercase tracking-wide text-secondary mb-2">Preferred Size</label>
            <select 
              value={size}
              onChange={(e) => setSize(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
            >
              <option value="6-inch">6-inch Round (Starts at ₱1,500)</option>
              <option value="8-inch">8-inch Round (Starts at ₱2,000)</option>
              <option value="10-inch">10-inch Round (Starts at ₱2,500)</option>
            </select>
            <span className="block text-xs text-text-muted mt-2 ml-1">* Final price may vary based on design complexity</span>
          </div>

          <div>
            <label className="block font-bold text-sm uppercase tracking-wide text-secondary mb-2">Filling</label>
            <select 
              value={filling}
              onChange={(e) => setFilling(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
            >
              <option value="" disabled>Select filling</option>
              <option value="Chocolate">Chocolate</option>
              <option value="Vanilla">Vanilla</option>
              <option value="White Chocolate">White Chocolate</option>
              <option value="Mango">Mango</option>
              <option value="Strawberry">Strawberry</option>
              <option value="Mocha">Mocha</option>
              <option value="Coffee">Coffee</option>
              <option value="Red Velvet">Red Velvet</option>
              <option value="Matcha">Matcha</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-sm uppercase tracking-wide text-secondary mb-2">Inspiration / Design Reference</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className={`relative px-4 py-3 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 ${fileName ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*" 
                  className="hidden"
                />
                <Upload size={20} className={fileName ? 'text-primary' : 'text-gray-400'} />
                <span className={`text-sm ${fileName ? 'text-primary font-semibold' : 'text-gray-500'}`}>
                  {fileName ? `Selected: ${fileName}` : 'Click to upload image'}
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon size={16} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  value={refLink}
                  onChange={(e) => setRefLink(e.target.value)}
                  placeholder="Or paste image link here" 
                  className="w-full pl-10 pr-4 py-3 h-full border border-gray-300 rounded-xl focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-sm uppercase tracking-wide text-secondary mb-2">Special Requests & Dedication</label>
            <textarea 
              value={requests}
              onChange={(e) => setRequests(e.target.value)}
              rows={4} 
              placeholder="Color palette, specific dedication, or any other preferences..."
              className="w-full p-4 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-y"
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full py-5 bg-gradient-to-r from-primary to-primary-dark text-white font-bold uppercase tracking-wider text-lg rounded-xl shadow-[0_10px_20px_rgba(212,160,23,0.3)] hover:shadow-[0_15px_30px_rgba(212,160,23,0.4)] hover:-translate-y-1 transition-all duration-300"
          >
            Proceed to Checkout
          </button>
        </form>
      </motion.div>
    </main>
  );
}
