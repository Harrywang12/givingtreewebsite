'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Gift, Leaf, Sparkles } from 'lucide-react';
import PageBanner from '@/components/PageBanner';

interface Donor {
  id: string;
  name: string;
  isAnonymous: boolean;
  amount?: number;
  message?: string;
  createdAt: string;
}

export default function DonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/donors');
      
      if (response.ok) {
        const data = await response.json();
        setDonors(data.donors || []);
      } else {
        setError('Failed to load donors');
      }
    } catch (error) {
      console.error('Error fetching donors:', error);
      setError('Failed to load donors');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount?: number) => {
    if (!amount) return null;
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading our generous donors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50">
      <PageBanner
        title="Our Generous Donors"
        subtitle="Celebrating the amazing individuals who make our mission possible"
      />

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center mb-6 px-6 py-3 bg-green-100 rounded-full">
              <Heart className="w-6 h-6 text-green-600 mr-3" />
              <span className="text-green-800 font-semibold">Community Impact</span>
            </div>
            
            <h2 className="text-4xl font-bold text-zinc-900 mb-6">
              Thank You to Our Amazing Donors
            </h2>
            
            <p className="text-xl text-green-800 max-w-3xl mx-auto leading-relaxed">
              Every donation, no matter the size, makes a real difference in supporting Mackenzie Health. 
              We're grateful for each and every person who has contributed to our mission.
            </p>
          </motion.div>

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchDonors}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {donors.length === 0 && !error ? (
            <div className="text-center py-12">
              <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">No Donors Yet</h3>
              <p className="text-green-800">
                We're just getting started! Check back soon to see our growing list of generous supporters.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {donors.map((donor, index) => (
                <motion.div
                  key={donor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-200 relative overflow-hidden">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-50 to-blue-100 rounded-full translate-y-8 -translate-x-8 opacity-50"></div>
                    
                    <div className="relative z-10">
                      {/* Donor Icon */}
                      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        {donor.isAnonymous ? (
                          <Users className="w-8 h-8 text-green-600" />
                        ) : (
                          <Heart className="w-8 h-8 text-green-600" />
                        )}
                      </div>

                      {/* Donor Name */}
                      <h3 className="text-xl font-bold text-zinc-900 text-center mb-2">
                        {donor.isAnonymous ? 'Anonymous Donor' : donor.name}
                      </h3>

                      {/* Donation Amount */}
                      {donor.amount && (
                        <div className="text-center mb-4">
                          <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                            <Gift className="w-4 h-4 mr-1" />
                            {formatAmount(donor.amount)}
                          </div>
                        </div>
                      )}

                      {/* Thank You Message */}
                      {donor.message && (
                        <div className="text-center mb-4">
                          <p className="text-gray-600 italic text-sm leading-relaxed">
                            "{donor.message}"
                          </p>
                        </div>
                      )}

                      {/* Date */}
                      <div className="text-center">
                        <div className="inline-flex items-center text-xs text-gray-500">
                          <Leaf className="w-3 h-3 mr-1" />
                          {formatDate(donor.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50/0 to-green-100/0 group-hover:from-green-50/20 group-hover:to-green-100/20 transition-all duration-300 rounded-2xl"></div>
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
                <Sparkles className="w-8 h-8 text-green-600 mr-2" />
                <h3 className="text-2xl font-bold text-zinc-900">Join Our Community</h3>
              </div>
              
              <p className="text-green-800 mb-6">
                Ready to make a difference? Your donation, no matter the size, helps us support Mackenzie Health and improve healthcare in our community.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/donate"
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Make a Donation
                </a>
                <a
                  href="/volunteer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-green-600 font-semibold rounded-lg border-2 border-green-600 hover:bg-green-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Volunteer
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
