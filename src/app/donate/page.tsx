'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PageBanner from '@/components/PageBanner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import {
  DollarSign,
  Package,
  Heart,
  ArrowRight,
  CreditCard,
  CheckCircle,
  User
} from 'lucide-react';
import DonationForm from '@/components/DonationForm';
import AuthModal from '@/components/AuthModal';

export default function DonatePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [donationType, setDonationType] = useState<'monetary' | 'item' | null>(null);
  const [donationMode, setDonationMode] = useState<'anonymous' | 'login' | null>(null);
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const presetAmounts = [25, 50, 100, 250, 500];

  const handleMonetaryDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount || amount;
    if (!finalAmount) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/donations/monetary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(finalAmount),
          type: 'MONETARY',
          paymentMethod: 'E_TRANSFER'
        })
      });

      if (response.ok) {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('Donation error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount.toString());
    setCustomAmount('');
  };

  const handleAnonymousDonation = () => {
    setDonationMode('anonymous');
  };

  const handleLoginToDonate = () => {
    if (user) {
      // User is already logged in, go to dashboard
      router.push('/dashboard');
    } else {
      // Show login modal
      setShowAuthModal(true);
    }
  };

  // handleAuthSuccess removed as it's handled in AuthContext

  if (isCompleted) {
    return (
      <div className="min-h-screen overflow-hidden relative py-20">
        
        <div className="max-w-2xl mx-auto text-center px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card card-highlight p-10 shadow-lg"
          >
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <motion.div 
                className="absolute inset-0"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeOut" 
                }}
              >
                <div className="w-24 h-24 rounded-full bg-green-200 opacity-50 mx-auto"></div>
              </motion.div>
            </div>
            
            <h2 className="text-3xl font-bold text-green-900 mb-4 font-serif">Thank You!</h2>
            <p className="text-lg text-green-700 mb-8 leading-relaxed">
              Your donation has been processed successfully. Your generosity will make a real difference 
              in supporting Mackenzie Health and our community. Together, we grow a healthier future.
            </p>
            
            <div className="space-y-5">
              <button
                onClick={() => {
                  setIsCompleted(false);
                  setDonationType(null);
                  setDonationMode(null);
                  setAmount('');
                  setCustomAmount('');
                }}
                className="btn btn-primary px-6 py-3 w-full"
              >
                <Heart className="h-5 w-5 mr-2" />
                Make Another Donation
              </button>
              <button
                onClick={() => router.push('/')}
                className="block w-full text-green-700 hover:text-green-600 font-medium"
              >
                Return to Homepage
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (donationType === 'item') {
    return (
      <div className="min-h-screen overflow-hidden py-20 relative">
        
        {/* Subtle leaf pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M30 0C19 0 5.3 12.5 0 30c5.3 17.5 19 30 30 30s24.7-12.5 30-30C54.7 12.5 41 0 30 0zm0 50c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z' fill='%234caf50' fill-opacity='.07'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="text-center">
              <button
                onClick={() => setDonationType(null)}
                className="text-green-700 hover:text-green-800 font-medium mb-6 inline-flex items-center group transition-colors"
              >
                <span className="mr-2 transition-transform transform group-hover:-translate-x-1">←</span>
                Back to donation options
              </button>
              <h1 className="text-4xl font-bold text-green-900 mb-4 font-serif">Donate Items</h1>
              <p className="text-xl text-green-700 max-w-2xl mx-auto">
                Help us support Mackenzie Health by donating gently used items. 
                Your donations help fund vital healthcare services.
              </p>
            </div>
          </motion.div>
          
          {/* Image banner showing donations being processed */}
          <div className="rounded-xl overflow-hidden mb-10 shadow-lg relative">
            <div className="h-56 md:h-72 relative">
              <Image 
                src="/personworking.jpg"
                alt="Volunteers sorting donated items" 
                fill
                sizes="(max-width: 768px) 100vw, 2000px"
                style={{objectFit: 'cover'}}
                className="brightness-[0.85]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-green-900/50 to-transparent"></div>
              
              <div className="absolute inset-0 flex items-center">
                <div className="ml-8 max-w-lg">
                  <h2 className="text-2xl font-bold text-white mb-2 font-serif">Every Item Makes a Difference</h2>
                  <p className="text-green-50/90 text-lg leading-relaxed">
                    Your donated items are sorted, processed and resold with 100% of 
                    proceeds going to support Mackenzie Health.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Donation Form in a card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card shadow-lg"
          >
            <DonationForm />
          </motion.div>
        </div>
      </div>
    );
  }

  // Show donation mode selection for monetary donations
  if (donationType === 'monetary' && !donationMode) {
    return (
      <div className="min-h-screen overflow-hidden py-20 relative">
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="text-center">
              <button
                onClick={() => setDonationType(null)}
                className="text-green-700 hover:text-green-800 font-medium mb-6 inline-flex items-center group transition-colors"
              >
                <span className="mr-2 transition-transform transform group-hover:-translate-x-1">←</span>
                Back to donation options
              </button>
              <h1 className="text-4xl font-bold text-green-900 mb-4 font-serif">Monetary Donation</h1>
              <p className="text-xl text-green-700 max-w-2xl mx-auto">
                Choose how you'd like to make your donation. Every contribution helps us grow our impact.
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-8 hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer relative overflow-hidden"
              onClick={handleAnonymousDonation}
            >
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100/50">
                  <Heart className="h-10 w-10 text-green-600" />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-200/30 to-transparent rounded-full"></div>
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-4 font-serif">Anonymous Donation</h3>
                <p className="text-green-700 mb-6 leading-relaxed">
                  Make a donation without creating an account. A quick and simple process to help make a difference.
                </p>
                <div className="inline-flex items-center justify-center text-green-700 font-medium px-4 py-2 rounded-lg bg-green-50 transition-colors hover:bg-green-100">
                  <span>Donate Anonymously</span>
                  <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
              
              {/* Subtle background decoration */}
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-green-50 rounded-full opacity-50 z-0"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-8 hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer relative overflow-hidden"
              onClick={handleLoginToDonate}
            >
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100/50">
                  <User className="h-10 w-10 text-green-600" />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-200/30 to-transparent rounded-full"></div>
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-4 font-serif">Login & Donate</h3>
                <p className="text-green-700 mb-6 leading-relaxed">
                  Create an account or login to track your donations and see the impact you're making with us.
                </p>
                <div className="inline-flex items-center justify-center text-green-700 font-medium px-4 py-2 rounded-lg bg-green-50 transition-colors hover:bg-green-100">
                  <span>{user ? 'Go to Dashboard' : 'Login to Donate'}</span>
                  <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
              
              {/* Subtle background decoration */}
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-green-50 rounded-full opacity-50 z-0"></div>
            </motion.div>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode="login"
        />
      </div>
    );
  }

  // Show anonymous donation form
  if (donationType === 'monetary' && donationMode === 'anonymous') {
    return (
      <div className="min-h-screen overflow-hidden py-20 relative">
        
        {/* Subtle leaf pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M30 0C19 0 5.3 12.5 0 30c5.3 17.5 19 30 30 30s24.7-12.5 30-30C54.7 12.5 41 0 30 0zm0 50c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z' fill='%234caf50' fill-opacity='.07'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="card p-8 shadow-lg">
              <div className="text-center mb-10">
                <button
                  onClick={() => setDonationMode(null)}
                  className="text-green-700 hover:text-green-800 font-medium mb-6 inline-flex items-center group transition-colors"
                >
                  <span className="mr-2 transition-transform transform group-hover:-translate-x-1">←</span>
                  Back to donation options
                </button>
                <h2 className="text-3xl font-bold text-green-900 mb-4 font-serif">Anonymous Donation</h2>
                <p className="text-green-700 max-w-lg mx-auto">
                  Your donation will directly support Mackenzie Health's mission to provide 
                  exceptional healthcare to our community. Every gift helps nurture healing.
                </p>
              </div>

              <form onSubmit={handleMonetaryDonation} className="space-y-8">
                <div>
                  <label className="block text-base font-medium text-green-800 mb-4">
                    Select Donation Amount
                  </label>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {presetAmounts.map((presetAmount) => (
                      <button
                        key={presetAmount}
                        type="button"
                        onClick={() => handleAmountSelect(presetAmount)}
                        className={`p-4 rounded-lg border-2 font-semibold transition-all hover:shadow-md ${
                          amount === presetAmount.toString()
                            ? 'border-green-500 bg-green-50 text-green-700 shadow-lg shadow-green-100'
                            : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                        }`}
                      >
                        ${presetAmount}
                      </button>
                    ))}
                  </div>
                  <div className="mt-6">
                    <label htmlFor="customAmount" className="block text-base font-medium text-green-800 mb-3">
                      Or enter a custom amount
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                      <input
                        type="number"
                        id="customAmount"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setAmount('');
                        }}
                        placeholder="Enter amount"
                        min="1"
                        className="field w-full pl-12"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="ml-3 text-green-700 font-medium">
                      100% of your donation goes directly to Mackenzie Health
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || (!amount && !customAmount)}
                  className="w-full btn btn-primary py-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Donate ${customAmount || amount}
                    </>
                  )}
                </button>
              </form>
            </div>
            
            {/* Security notice */}
            <div className="mt-6 text-center text-green-700 text-sm flex justify-center items-center">
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C16.9706 22 21 17.9706 21 13C21 8.02944 16.9706 4 12 4C7.02944 4 3 8.02944 3 13C3 17.9706 7.02944 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14.5C13.3807 14.5 14.5 13.3807 14.5 12C14.5 10.6193 13.3807 9.5 12 9.5C10.6193 9.5 9.5 10.6193 9.5 12C9.5 13.3807 10.6193 14.5 12 14.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Secure payment processing through our trusted partners
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden">
      <PageBanner 
        title="Make a Donation" 
        subtitle="Choose how you'd like to support Mackenzie Health. Every contribution makes a difference in enhancing patient care and advancing medical research." 
      />
      
      <section className="py-20 relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none opacity-10" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='96' viewBox='0 0 60 96'%3E%3Cg fill='%234caf50' fill-opacity='0.3'%3E%3Cpath d='M36 10a6 6 0 0 1 12 0v12a6 6 0 0 1-12 0V10zm24 78a6 6 0 0 1-6 6h-12a6 6 0 0 1 0-12h12a6 6 0 0 1 6 6zM4 72a6 6 0 0 1-4-10l8-8a6 6 0 0 1 8 8l-8 8a5.9 5.9 0 0 1-4 2z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 96px'
          }}>
        </div>
        

      
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center mb-6">
              <span className="inline-block h-0.5 w-10 bg-green-300 mr-3"></span>
              <span className="text-green-600 font-medium uppercase tracking-wider text-sm">Support Our Mission</span>
              <span className="inline-block h-0.5 w-10 bg-green-300 ml-3"></span>
            </div>
            
            <h2 className="text-3xl font-bold text-green-900 mb-6 font-serif">Choose Your Donation Type</h2>
            <p className="text-lg text-green-700 max-w-3xl mx-auto">
              Your generosity helps us provide better care and create a healthier future for our community.
              Every contribution nurtures growth and healing at Mackenzie Health.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -8 }}
              className="card p-10 shadow-lg cursor-pointer relative overflow-hidden group"
              onClick={() => setDonationType('monetary')}
            >
              <div className="relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100/50 transition-transform group-hover:scale-110 duration-300">
                  <DollarSign className="h-12 w-12 text-green-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-green-900 mb-4 font-serif text-center">Monetary Donation</h3>
                
                <p className="text-green-700 mb-8 leading-relaxed">
                  Make a direct financial contribution to support hospital initiatives, 
                  medical equipment, and patient care programs. Your monetary gift 
                  provides flexible support where it's needed most.
                </p>
                
                <div className="flex items-center justify-center">
                  <span className="btn btn-primary inline-flex items-center">
                    <span>Donate Now</span>
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
              
              {/* Animated background decoration */}
              <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-green-50 rounded-full z-0 opacity-0 group-hover:opacity-50 transition-opacity"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -8 }}
              className="card p-10 shadow-lg cursor-pointer relative overflow-hidden group"
              onClick={() => setDonationType('item')}
            >
              <div className="relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100/50 transition-transform group-hover:scale-110 duration-300">
                  <Package className="h-12 w-12 text-green-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-green-900 mb-4 font-serif text-center">Item Donation</h3>
                
                <p className="text-green-700 mb-8 leading-relaxed">
                  Donate gently used items that we'll resell to raise funds for the hospital. 
                  Help reduce waste while supporting healthcare. Your items find new homes 
                  while funding vital services.
                </p>
                
                <div className="flex items-center justify-center">
                  <span className="btn btn-primary inline-flex items-center">
                    <span>Donate Items</span>
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
              
              {/* Animated background decoration */}
              <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-green-50 rounded-full z-0 opacity-0 group-hover:opacity-50 transition-opacity"></div>
            </motion.div>
          </div>
          
          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto mt-16 bg-white rounded-xl p-8 shadow-md border border-green-100 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-20 h-20 opacity-10">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32C16.5203 32 17.0323 31.9659 17.5348 31.8998C16.5734 34.7828 14.9737 37.5282 12.8379 39.9491C10.5739 42.5289 7.75764 44.6746 4.52796 46.295C4.17412 46.4854 3.95884 46.8567 3.97045 47.2532C3.98206 47.6496 4.21896 48.0073 4.58316 48.1775C4.94736 48.3476 5.37924 48.3087 5.70439 48.0755C12.106 43.6542 16.5203 36.989 18.2852 29.4054C21.7093 27.0654 24.2624 23.568 25.469 19.5H20C18.8954 19.5 18 18.6046 18 17.5C18 16.3954 18.8954 15.5 20 15.5H27C27.8254 15.5 28.5 14.8254 28.5 14V7C28.5 5.89543 29.3954 5 30.5 5C31.6046 5 32.5 5.89543 32.5 7V15.9C32.3349 15.9336 32.1679 15.9649 32 16Z" fill="#4CAF50"/>
                <path d="M80 16C80 7.16344 72.8366 0 64 0C55.1634 0 48 7.16344 48 16C48 24.8366 55.1634 32 64 32C64.5203 32 65.0323 31.9659 65.5348 31.8998C64.5734 34.7828 62.9737 37.5282 60.8379 39.9491C58.5739 42.5289 55.7576 44.6746 52.528 46.295C52.1741 46.4854 51.9588 46.8567 51.9705 47.2532C51.9821 47.6496 52.219 48.0073 52.5832 48.1775C52.9474 48.3476 53.3792 48.3087 53.7044 48.0755C60.106 43.6542 64.5203 36.989 66.2852 29.4054C69.7093 27.0654 72.2624 23.568 73.469 19.5H68C66.8954 19.5 66 18.6046 66 17.5C66 16.3954 66.8954 15.5 68 15.5H75C75.8254 15.5 76.5 14.8254 76.5 14V7C76.5 5.89543 77.3954 5 78.5 5C79.6046 5 80.5 5.89543 80.5 7V15.9C80.3349 15.9336 80.1679 15.9649 80 16Z" fill="#4CAF50"/>
              </svg>
            </div>
            
            <blockquote className="text-green-800 text-lg leading-relaxed italic text-center mb-6 relative z-10">
              The Giving Tree Foundation's dedication to supporting Mackenzie Health 
              through community donations has made a real impact on the quality of care 
              we can provide. Every donation, no matter the size, helps nurture healthier lives.
            </blockquote>
            
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="font-bold text-green-900">Dr. Sarah Johnson</div>
                <div className="text-green-600 text-sm">Chief of Medicine, Mackenzie Health</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode="login"
      />
    </div>
  );
} 