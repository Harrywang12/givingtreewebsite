'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Heart, DollarSign, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MonetaryDonationFormProps {
  isAnonymous?: boolean;
}

export default function MonetaryDonationForm({ isAnonymous = false }: MonetaryDonationFormProps) {
  const router = useRouter();
  const { user, token } = useAuth();
  const [amount, setAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const predefinedAmounts = ['25', '50', '100', '250', '500'];

  const handleAmountSelect = (value: string) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setCustomAmount(value);
      setAmount('custom');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    try {
      const donationAmount = amount === 'custom' ? parseFloat(customAmount) : parseFloat(amount);
      
      if (isNaN(donationAmount) || donationAmount <= 0) {
        throw new Error('Please enter a valid donation amount');
      }

      // For anonymous donations, we'll create a temporary record
      // For logged-in users, we'll create a proper donation record
      if (isAnonymous) {
        // Generate a unique return URL for anonymous donations
        const returnUrl = `${window.location.origin}/donate/confirm?amount=${donationAmount}&anonymous=true`;
        
        // Redirect to the intermediate page before going to Mackenzie Health
        router.push(`/donate/redirect?amount=${donationAmount}&anonymous=true&returnUrl=${encodeURIComponent(returnUrl)}`);
      } else {
        // Create a donation record in our system first
        const response = await fetch('/api/donations/monetary/intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            amount: donationAmount,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to process donation');
        }

        // Generate a unique return URL with donation ID and amount
        const returnUrl = `${window.location.origin}/donate/confirm?amount=${donationAmount}&id=${data.donationId}`;
        
        // Redirect to the intermediate page before going to Mackenzie Health
        router.push(`/donate/redirect?amount=${donationAmount}&id=${data.donationId}&type=monetary&returnUrl=${encodeURIComponent(returnUrl)}`);
      }
      
    } catch (error) {
      console.error('Donation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process donation');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {isAnonymous ? 'Make an Anonymous Donation' : 'Make a Donation'}
          </h2>
          <p className="text-gray-600">
            Your donation helps us support Mackenzie Health. 100% of proceeds go directly to enhancing patient care.
            {isAnonymous && (
              <span className="block mt-2 text-sm text-gray-500">
                As an anonymous donor, your contribution will still be tracked and may qualify for our leaderboard.
              </span>
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Donation Amount
            </label>
            <div className="grid grid-cols-3 gap-3">
              {predefinedAmounts.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleAmountSelect(value)}
                  className={`py-3 px-4 border rounded-lg font-medium ${
                    amount === value
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  ${value}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleAmountSelect('custom')}
                className={`py-3 px-4 border rounded-lg font-medium ${
                  amount === 'custom'
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Custom
              </button>
            </div>
          </div>

          {amount === 'custom' && (
            <div>
              <label htmlFor="customAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Enter Custom Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="customAmount"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isProcessing || (!amount || (amount === 'custom' && !customAmount))}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  {isAnonymous ? 'Donate Anonymously' : 'Donate'} {amount && amount !== 'custom' ? `$${amount}` : amount === 'custom' && customAmount ? `$${customAmount}` : ''}
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="text-center text-sm text-gray-500 mt-4">
            <p>You will be redirected to Mackenzie Health's secure donation platform to complete your donation.</p>
            <p className="mt-1">100% of your donation goes directly to supporting Mackenzie Health.</p>
            {isAnonymous && (
              <p className="mt-2 text-xs text-gray-400">
                Anonymous donations are tracked by amount and may appear on our leaderboard.
              </p>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
