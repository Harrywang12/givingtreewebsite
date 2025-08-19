'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DonationForm from '@/components/DonationForm';
import MonetaryDonationForm from '@/components/MonetaryDonationForm';
import { Heart, DollarSign, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

function DonateContent() {
  const [activeTab, setActiveTab] = useState('monetary');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuth();
  const isAnonymous = searchParams.get('anonymous') === 'true';
  
  // If user is not logged in and not anonymous, redirect to choice page
  useEffect(() => {
    if (!user && !token && !isAnonymous) {
      router.push('/donate/choice');
    }
  }, [user, token, isAnonymous, router]);

  // If redirecting, show loading
  if (!user && !token && !isAnonymous) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-800">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-green-900 mb-6 font-serif">Make a Difference</h1>
          <p className="text-lg text-green-800 max-w-3xl mx-auto">
            Your generosity helps us support Mackenzie Health. Choose how you'd like to contribute below.
            {isAnonymous && (
              <span className="block mt-2 text-sm text-gray-600">
                You're donating anonymously. Your contribution will still be tracked and may qualify for our leaderboard.
              </span>
            )}
          </p>
        </motion.div>
        
        <Tabs defaultValue="monetary" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-white shadow-md">
              <TabsTrigger value="monetary" className="flex items-center space-x-2 px-6 py-3">
                <DollarSign className="h-5 w-5" />
                <span>Monetary Donation</span>
              </TabsTrigger>
              <TabsTrigger value="items" className="flex items-center space-x-2 px-6 py-3">
                <Package className="h-5 w-5" />
                <span>Donate Items</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="monetary">
            <MonetaryDonationForm isAnonymous={isAnonymous} />
          </TabsContent>
          
          <TabsContent value="items">
            <DonationForm isAnonymous={isAnonymous} />
          </TabsContent>
        </Tabs>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-white rounded-lg shadow-lg p-8"
        >
          <div className="flex items-center justify-center mb-6">
            <Heart className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-2xl font-bold text-green-900">Why Your Support Matters</h2>
          </div>
          
          <div className="prose max-w-none text-gray-700">
            <p>
              The Giving Tree Foundation transforms community generosity into tangible improvements for healthcare. 
              Every donation, whether monetary or in the form of gently used items, makes a significant impact:
            </p>
            
            <ul className="mt-4 space-y-2">
              <li>100% of proceeds go directly to Mackenzie Health</li>
              <li>Your donations help fund essential medical equipment</li>
              <li>Support enhances patient care and comfort</li>
              <li>Contributions help create a more sustainable healthcare system</li>
              <li>Your generosity builds a stronger, healthier community</li>
            </ul>
            
            <p className="mt-6">
              Thank you for joining us in our mission to support Mackenzie Health and make a difference in healthcare for all.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-800">Loading donation page...</p>
        </div>
      </div>
    }>
      <DonateContent />
    </Suspense>
  );
}