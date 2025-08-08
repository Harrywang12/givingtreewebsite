'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  DollarSign, 
  Package, 
  Heart, 
  ArrowRight,
  CheckCircle,
  User,
  Lock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';
import DonationForm from '@/components/DonationForm';

export default function DonatePage() {
  const { user } = useAuth();
  const router = useRouter();
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
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsCompleted(true);
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

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Redirect to dashboard after successful login
    router.push('/dashboard');
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
            <p className="text-lg text-gray-600 mb-6">
              Your donation has been processed successfully. Your generosity will make a real difference 
              in supporting Mackenzie Health and our community.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => {
                  setIsCompleted(false);
                  setDonationType(null);
                  setDonationMode(null);
                  setAmount('');
                  setCustomAmount('');
                }}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Make Another Donation
              </button>
              <button
                onClick={() => router.push('/')}
                className="block w-full text-green-600 hover:text-green-700 font-semibold"
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <button
              onClick={() => setDonationType(null)}
              className="text-green-600 hover:text-green-700 font-semibold mb-4 inline-flex items-center"
            >
              ← Back to donation options
            </button>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Donate Items</h1>
            <p className="text-xl text-gray-600">
              Help us support Mackenzie Health by donating gently used items
            </p>
          </div>
          <DonationForm />
        </div>
      </div>
    );
  }

  // Show donation mode selection for monetary donations
  if (donationType === 'monetary' && !donationMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <button
              onClick={() => setDonationType(null)}
              className="text-green-600 hover:text-green-700 font-semibold mb-4 inline-flex items-center"
            >
              ← Back to donation options
            </button>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Monetary Donation</h1>
            <p className="text-xl text-gray-600">
              Choose how you'd like to make your donation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={handleAnonymousDonation}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Anonymous Donation</h3>
                <p className="text-gray-600 mb-6">
                  Make a donation without creating an account. Quick and simple process.
                </p>
                <div className="flex items-center justify-center text-green-600 font-semibold">
                  <span>Donate Anonymously</span>
                  <ArrowRight className="h-5 w-5 ml-2" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={handleLoginToDonate}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Login & Donate</h3>
                <p className="text-gray-600 mb-6">
                  Create an account or login to track your donations and view your impact.
                </p>
                <div className="flex items-center justify-center text-blue-600 font-semibold">
                  <span>{user ? 'Go to Dashboard' : 'Login to Donate'}</span>
                  <ArrowRight className="h-5 w-5 ml-2" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Show anonymous donation form
  if (donationType === 'monetary' && donationMode === 'anonymous') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <button
              onClick={() => setDonationMode(null)}
              className="text-green-600 hover:text-green-700 font-semibold mb-4 inline-flex items-center"
            >
              ← Back to donation options
            </button>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Anonymous Donation</h2>
            <p className="text-gray-600">
              Your donation will directly support Mackenzie Health's mission to provide 
              exceptional healthcare to our community.
            </p>
          </div>

          <form onSubmit={handleMonetaryDonation} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Select Donation Amount
              </label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {presetAmounts.map((presetAmount) => (
                  <button
                    key={presetAmount}
                    type="button"
                    onClick={() => handleAmountSelect(presetAmount)}
                    className={`p-4 rounded-lg border-2 font-semibold transition-colors ${
                      amount === presetAmount.toString()
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    ${presetAmount}
                  </button>
                ))}
              </div>
              <div>
                <label htmlFor="customAmount" className="block text-sm font-medium text-gray-700 mb-2">
                  Or enter a custom amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Heart className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-sm text-green-700">
                  100% of your donation goes directly to Mackenzie Health
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing || (!amount && !customAmount)}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Make a Donation</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose how you'd like to support Mackenzie Health. Every contribution makes a difference 
            in enhancing patient care and advancing medical research.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setDonationType('monetary')}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Monetary Donation</h3>
              <p className="text-gray-600 mb-6">
                Make a direct financial contribution to support hospital initiatives, 
                medical equipment, and patient care programs.
              </p>
              <div className="flex items-center justify-center text-green-600 font-semibold">
                <span>Donate Now</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setDonationType('item')}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Item Donation</h3>
              <p className="text-gray-600 mb-6">
                Donate gently used items that we'll resell to raise funds for the hospital. 
                Help reduce waste while supporting healthcare.
              </p>
              <div className="flex items-center justify-center text-blue-600 font-semibold">
                <span>Donate Items</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </div>
            </div>
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