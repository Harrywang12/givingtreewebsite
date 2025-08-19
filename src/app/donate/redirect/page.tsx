'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Heart } from 'lucide-react';

function DonationRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuth();
  const [countdown, setCountdown] = useState(5);
  
  // Extract donation details from URL parameters
  const amount = searchParams.get('amount');
  const donationType = searchParams.get('type');
  const donationId = searchParams.get('id');
  const isAnonymous = searchParams.get('anonymous') === 'true';
  
  // Get return URL from params or create default
  const returnUrl = searchParams.get('returnUrl') || `${typeof window !== 'undefined' ? window.location.origin : ''}/donate/confirm?amount=${amount}&id=${donationId}${isAnonymous ? '&anonymous=true' : ''}`;
  
  // Mackenzie Health donation URL with return parameters
  const mackenzieHealthDonationUrl = `https://supportmackenziehealth.ca/ui/thegivingtree/donations/start?return_url=${encodeURIComponent(returnUrl)}`;
  
  useEffect(() => {
    // Record the donation intent in our system
    const recordDonationIntent = async () => {
      if (!amount) return;
      
      try {
        if (isAnonymous) {
          // For anonymous donations, we don't need to record intent in our system
          // They'll be tracked when they return from Mackenzie Health
          console.log('Anonymous donation - no intent recording needed');
        } else if (token && donationId) {
          // For logged-in users, record the donation intent
          await fetch('/api/donations/monetary/intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              amount: parseFloat(amount),
              donationId,
              redirectUrl: mackenzieHealthDonationUrl
            })
          });
        }
      } catch (error) {
        console.error('Error recording donation intent:', error);
      }
    };
    
    recordDonationIntent();
    
    // Start countdown for redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect to Mackenzie Health donation page
          window.location.href = mackenzieHealthDonationUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [amount, donationId, token, mackenzieHealthDonationUrl, isAnonymous]);
  
  // Handle manual redirect
  const handleRedirectNow = () => {
    window.location.href = mackenzieHealthDonationUrl;
  };
  
  // Handle cancel and return to donation form
  const handleCancel = () => {
    if (isAnonymous) {
      router.push('/donate/choice');
    } else {
      router.push('/donate');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Redirecting to Mackenzie Health</h2>
          <p className="text-gray-600">
            You're being redirected to complete your ${amount} donation securely through Mackenzie Health's official donation platform.
            {isAnonymous && (
              <span className="block mt-2 text-sm text-gray-500">
                You're donating anonymously. Your contribution will still be tracked.
              </span>
            )}
          </p>
          <div className="mt-4 text-green-600 font-medium">
            Redirecting in {countdown} seconds...
          </div>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={handleRedirectNow}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            Continue to Mackenzie Health
          </button>
          
          <button
            onClick={handleCancel}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel Donation
          </button>
        </div>
        
        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>You will complete your donation on the secure Mackenzie Health website.</p>
          <p className="mt-1">After donating, please return to confirm your contribution for our records.</p>
        </div>
      </div>
    </div>
  );
}

export default function DonationRedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading...</h2>
            <p className="text-gray-600">Preparing your donation redirect...</p>
          </div>
        </div>
      </div>
    }>
      <DonationRedirectContent />
    </Suspense>
  );
}
