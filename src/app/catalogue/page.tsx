'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Package, Heart, Gift, DollarSign } from 'lucide-react';
import PageBanner from '@/components/PageBanner';
import EventImage from '@/components/EventImage';
import Link from 'next/link';
import logger from '@/lib/logger';

interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  price?: number;
  category?: string;
  condition?: string;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: string;
}

export default function CataloguePage() {
  const [allItems, setAllItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory] = useState('');
  const [selectedCondition] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch items only once on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      
      // Fetch all items once
      const response = await fetch('/api/inventory');
      
      if (response.ok) {
        const data = await response.json();
        setAllItems(data.items || []);
      } else {
        setError('Failed to load inventory');
      }
    } catch (error) {
      logger.error('Error fetching inventory:', error);
      setError('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };
  
  // Filter items client-side based on search and filter criteria
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      // Search term filter
      const matchesSearch = !debouncedSearchTerm || 
        item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (item.description?.toLowerCase() || '').includes(debouncedSearchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      
      // Condition filter
      const matchesCondition = !selectedCondition || item.condition === selectedCondition;
      
      return matchesSearch && matchesCategory && matchesCondition;
    });
  }, [allItems, debouncedSearchTerm, selectedCategory, selectedCondition]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading our inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50">
      <PageBanner
        title="Catalogue"
        subtitle="Our available items"
      />

      {/* Main Section */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchItems}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}


          {/* Items Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">No Items Found</h3>
              <p className="text-green-800">
                {searchTerm || selectedCategory || selectedCondition 
                  ? 'Try adjusting your search or filters to find what you\'re looking for.'
                  : 'We\'re currently updating our inventory. Check back soon for new items!'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  {item.imageUrl ? (
                    <EventImage 
                      src={item.imageUrl} 
                      alt={item.name || "Catalogue item"}
                      className="w-full h-auto rounded-lg shadow-md hover:shadow-xl transition-all duration-300 max-w-full"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center shadow-md">
                      <Package className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Donation Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white"
          >
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <Gift className="h-8 w-8" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4">Support Our Mission</h3>
              <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                Every purchase and donation helps us continue our mission of supporting Mackenzie Health and our community. 
                Your contribution makes a real difference in people's lives.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/donate"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors duration-200 shadow-lg"
                >
                  <DollarSign className="h-5 w-5 mr-2" />
                  Make a Donation
                </Link>
                
                <Link
                  href="/volunteer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors duration-200 border border-green-500"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Volunteer With Us
                </Link>
              </div>
              
              <p className="text-sm text-green-200 mt-4">
                All donations are tax-deductible and directly support Mackenzie Health
              </p>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
