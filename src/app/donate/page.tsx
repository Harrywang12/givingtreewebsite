'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DonationForm from '@/components/DonationForm';
import MonetaryDonationForm from '@/components/MonetaryDonationForm';
import { Heart, DollarSign, Package } from 'lucide-react';

export default function DonatePage() {
  const [activeTab, setActiveTab] = useState('monetary');
  
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
            <MonetaryDonationForm />
          </TabsContent>
          
          <TabsContent value="items">
            <DonationForm />
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