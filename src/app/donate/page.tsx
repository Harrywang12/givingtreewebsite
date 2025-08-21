'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DonationForm from '@/components/DonationForm';
import MonetaryDonationForm from '@/components/MonetaryDonationForm';
import { Heart, DollarSign, Package } from 'lucide-react';

function DonateContent() {
  const [activeTab, setActiveTab] = useState('monetary');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <Heart className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
            Make a Difference Today
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose how you'd like to support our mission. Every contribution helps us support Mackenzie Health 
            and make a positive impact in our community.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="monetary" className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Monetary Donation</span>
              </TabsTrigger>
              <TabsTrigger value="items" className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Item Donation</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="monetary" className="mt-0">
              <MonetaryDonationForm />
            </TabsContent>

            <TabsContent value="items" className="mt-0">
              <DonationForm />
            </TabsContent>
          </Tabs>
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
          <p className="text-gray-600">Loading donation page...</p>
        </div>
      </div>
    }>
      <DonateContent />
    </Suspense>
  );
}