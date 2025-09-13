'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Tag, Star, Search, Filter, Package, Heart } from 'lucide-react';
import PageBanner from '@/components/PageBanner';
import EventImage from '@/components/EventImage';

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
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inventory');
      
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      } else {
        setError('Failed to load inventory');
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Price on request';
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(price);
  };

  const getConditionColor = (condition?: string) => {
    switch (condition?.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get unique categories and conditions for filters
  const categories = Array.from(new Set(items.map(item => item.category).filter(Boolean)));
  const conditions = Array.from(new Set(items.map(item => item.condition).filter(Boolean)));

  // Filter items based on search and filters
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesCondition = !selectedCondition || item.condition === selectedCondition;
    
    return matchesSearch && matchesCategory && matchesCondition && item.isAvailable;
  });

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
        title="Our Catalogue"
        subtitle="Discover amazing items while supporting Mackenzie Health"
      />

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center mb-6 px-6 py-3 bg-green-100 rounded-full">
              <ShoppingBag className="w-6 h-6 text-green-600 mr-3" />
              <span className="text-green-800 font-semibold">Supporting Healthcare</span>
            </div>
            
            <h2 className="text-4xl font-bold text-zinc-900 mb-6">
              Find Great Deals, Make a Difference
            </h2>
            
            <p className="text-xl text-green-800 max-w-3xl mx-auto leading-relaxed">
              Browse our carefully curated collection of donated items. Every purchase directly supports 
              Mackenzie Health, helping us provide better healthcare for our community.
            </p>
          </motion.div>

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

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Condition Filter */}
                <div className="relative">
                  <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">All Conditions</option>
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setSelectedCondition('');
                  }}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </motion.div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600">
              Showing {filteredItems.length} of {items.filter(item => item.isAvailable).length} items
            </p>
          </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 overflow-hidden">
                    {/* Item Image */}
                    <div className="relative h-48 bg-gray-100">
                      {item.imageUrl ? (
                        <EventImage 
                          src={item.imageUrl} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Condition Badge */}
                      {item.condition && (
                        <div className="absolute top-3 right-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(item.condition)}`}>
                            {item.condition}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="p-6">
                      {/* Category */}
                      {item.category && (
                        <div className="mb-2">
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            <Tag className="w-3 h-3 mr-1" />
                            {item.category}
                          </span>
                        </div>
                      )}

                      {/* Item Name */}
                      <h3 className="text-lg font-bold text-zinc-900 mb-2 line-clamp-2">
                        {item.name}
                      </h3>

                      {/* Description */}
                      {item.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {item.description}
                        </p>
                      )}

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-green-600">
                          {formatPrice(item.price)}
                        </div>
                        
                        <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                          <Heart className="w-4 h-4 mr-1" />
                          Inquire
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-100 max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-green-600 mr-2" />
                <h3 className="text-2xl font-bold text-zinc-900">Interested in an Item?</h3>
              </div>
              
              <p className="text-green-800 mb-6">
                Contact us to learn more about any item or to arrange a viewing. 
                All proceeds support Mackenzie Health and help improve healthcare in our community.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <Package className="w-5 h-5 mr-2" />
                  Contact Us
                </a>
                <a
                  href="/donate"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-green-600 font-semibold rounded-lg border-2 border-green-600 hover:bg-green-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Donate Items
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
