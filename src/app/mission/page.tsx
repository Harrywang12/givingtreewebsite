'use client';

import { motion } from 'framer-motion';
import { Leaf, Heart, Users } from 'lucide-react';
import PageBanner from '@/components/PageBanner';

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50">
      <PageBanner
        title="Our Mission"
        subtitle="Supporting Mackenzie Health through community generosity and sustainable giving"
      />

      {/* Mission Statement */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-zinc-900 mb-8">Mission Statement</h2>
            <p className="text-xl text-zinc-600 max-w-4xl mx-auto leading-relaxed">
              Our mission is to support Mackenzie Health by collecting and reselling gently used items. 
              Through the generosity of our community, 100% of the proceeds will go directly toward 
              enhancing patient care, advancing medical research, and improving hospital facilities.
            </p>
          </motion.div>

          {/* Vision */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 card"
            >
              <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Reduce Waste</h3>
              <p className="text-zinc-600">Prevent items from ending up in landfills</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center p-6 card"
            >
              <Heart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Support Local Healthcare</h3>
              <p className="text-zinc-600">Direct funding for Mackenzie Health</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center p-6 card"
            >
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Inspire the Next Generation</h3>
              <p className="text-zinc-600">Building a culture of giving</p>
            </motion.div>
          </div>

          {/* Statistics Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          className="text-center p-8 rounded-2xl texture-leaf"
          >
            <h3 className="text-2xl font-bold mb-4">Our Impact</h3>
          <p className="text-zinc-600">Statistics coming soon - track our progress in raising funds and reducing waste!</p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 text-zinc-900">Join Our Mission</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-zinc-700">
              Every donation, no matter the size, helps us support Mackenzie Health and make a difference in our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => (window.location.href = '/donate')} className="btn btn-primary px-8 py-3">
                Make a Donation
              </button>
              <button onClick={() => (window.location.href = '/about')} className="inline-flex items-center justify-center rounded-xl border border-emerald-200 px-8 py-3 font-semibold text-emerald-700 hover:bg-emerald-50">
                Learn More About Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 