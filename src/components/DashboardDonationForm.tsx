'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  DollarSign, 
  Heart, 
  CheckCircle,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardDonationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardDonationForm({ isOpen, onClose }: DashboardDonationFormProps) {
  const { user, token } = useAuth();
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState('');

  const presetAmounts = [25, 50, 100, 250, 500];

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount.toString());
    setCustomAmount('');
    setError('');
  };

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount || amount;
    if (!finalAmount) {
      setError('Please select or enter an amount');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const response = await fetch('/api/donations/monetary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(finalAmount),
          type: 'MONETARY',
          paymentMethod: 'E_TRANSFER' // Default payment method
        })
      });

      if (response.ok) {
        setIsCompleted(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to process donation');
      }
    } catch (error) {
      console.error('Donation error:', error);
      setError('An error occurred while processing your donation');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
      setAmount('');
      setCustomAmount('');
      setError('');
      setIsCompleted(false);
    }
  };

  if (!isOpen) return null;

  if (isCompleted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        >
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your donation has been processed successfully. Your generosity will make a real difference 
              in supporting Mackenzie Health and our community.
            </p>
            <button
              onClick={handleClose}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Make a Donation</h2>
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <Heart className="h-5 w-5 text-blue-600 mr-2" />
            <p className="text-sm text-blue-700">
              Donating as <strong>{user?.name}</strong>
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleDonation} className="space-y-6">
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
                    setError('');
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
      </motion.div>
    </div>
  );
}
