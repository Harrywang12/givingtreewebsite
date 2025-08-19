'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function DonationConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [showReceiptForm, setShowReceiptForm] = useState(false);
  const [receiptData, setReceiptData] = useState({
    receiptNumber: '',
    donationDate: ''
  });
  
  // Extract donation details from URL parameters
  const amount = searchParams.get('amount');
  const donationId = searchParams.get('id');
  // Check if this is a return from Mackenzie Health with success parameter
  const success = searchParams.get('success');
  
  // Effect to auto-confirm if returning with success parameter
  useEffect(() => {
    if (success === 'true' && donationId && !isConfirmed && !isSubmitting) {
      // Automatically confirm the donation without requiring receipt verification
      handleConfirmDonation();
    }
  }, [success, donationId, isConfirmed, isSubmitting]);

  const handleConfirmDonation = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/donations/monetary/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          donationId,
          amount: parseFloat(amount || '0')
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsConfirmed(true);
      } else {
        setError(data.error || 'Failed to confirm donation');
      }
    } catch (error) {
      console.error('Error confirming donation:', error);
      setError('Failed to confirm donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleShowReceiptForm = () => {
    setShowReceiptForm(true);
  };
  
  const handleVerifyWithReceipt = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/donations/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          donationId,
          receiptNumber: receiptData.receiptNumber,
          donationDate: receiptData.donationDate,
          amount: parseFloat(amount || '0')
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsConfirmed(true);
      } else {
        setError(data.error || 'Failed to verify donation');
      }
    } catch (error) {
      console.error('Error verifying donation:', error);
      setError('Failed to verify donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };
  
  const handleGoHome = () => {
    router.push('/');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 sm:p-8"
      >
        {isConfirmed ? (
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your donation of ${amount} has been confirmed and added to your profile. Thank you for supporting Mackenzie Health!
            </p>
            
            <div className="space-y-3">
              {user && (
                <button
                  onClick={handleGoToDashboard}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  View Your Donations
                </button>
              )}
              
              <button
                onClick={handleGoHome}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              {success === 'true' ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Your Donation</h2>
                  <p className="text-gray-600">
                    Thank you for your ${amount} donation to Mackenzie Health! We're updating your donation history...
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Your Donation</h2>
                  <p className="text-gray-600">
                    Did you complete your ${amount} donation to Mackenzie Health? Please confirm to update your donation history.
                  </p>
                </>
              )}
            </div>
            
            {success === 'true' ? (
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
                <p className="text-center text-gray-600">
                  Your donation is being confirmed automatically...
                </p>
              </div>
            ) : showReceiptForm ? (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Receipt/Confirmation Number
                  </label>
                  <input
                    type="text"
                    value={receiptData.receiptNumber}
                    onChange={(e) => setReceiptData({...receiptData, receiptNumber: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter the receipt number from Mackenzie Health"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Donation Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={receiptData.donationDate}
                    onChange={(e) => setReceiptData({...receiptData, donationDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleVerifyWithReceipt}
                  disabled={isSubmitting || !receiptData.receiptNumber}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    'Verify Donation'
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleConfirmDonation}
                  disabled={isSubmitting}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Yes, I Completed My Donation'
                  )}
                </button>
                
                <button
                  onClick={handleShowReceiptForm}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Verify with Receipt Number
                </button>
                
                <button
                  onClick={handleGoHome}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  No, I'll Donate Later
                </button>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <X className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
