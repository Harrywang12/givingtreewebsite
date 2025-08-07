'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Users, Leaf } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-green-100 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About Us</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Turning generosity into tangible support for healthcare in our community
            </p>
          </motion.div>
        </div>
      </div>

      {/* About Us Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Story</h2>
            <div className="max-w-4xl mx-auto text-lg text-gray-600 leading-relaxed">
              <p className="mb-6">
                The Giving Tree Non-Profit Foundation is dedicated to turning generosity into tangible support 
                for healthcare in our community. Our mission is to uplift and strengthen Mackenzie Health by 
                collecting and reselling gently used items, with 100% of the proceeds donated directly to the hospital.
              </p>
              <p className="mb-6">
                We believe in the power of everyday giving to drive meaningful change. By connecting donated 
                goods with new owners, we not only reduce waste but also fund improved patient care, 
                cutting-edge research, and better hospital facilities.
              </p>
              <p>
                Founded in September of 2025 by Ruogu Qiu and Justin Wu, the Giving Tree Foundation stands 
                as a testament to what compassion and community can achieve together. Join us as we grow a 
                healthier future — one donation at a time.
              </p>
            </div>
          </motion.div>

          {/* What We Do */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg mb-16"
          >
            <h3 className="text-2xl font-bold text-center mb-6">What We Do</h3>
            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
              At the Giving Tree Foundation, we transform donated, gently used items into life-changing 
              contributions for our local hospital, Mackenzie Health. Our process is simple but powerful: 
              community members donate items they no longer need, we carefully sort and resell them, and 
              100% of the proceeds go directly to support hospital initiatives.
            </p>
          </motion.div>

          {/* Our Process */}
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Collect Donations</h3>
              <p className="text-gray-600">
                Community members donate gently used items they no longer need
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Sort & Resell</h3>
              <p className="text-gray-600">
                We carefully sort items and resell them to new owners
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Support Healthcare</h3>
              <p className="text-gray-600">
                100% of proceeds go directly to Mackenzie Health initiatives
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Be part of our mission to support Mackenzie Health and make a difference in healthcare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/donate'}
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Make a Donation
              </button>
              <button 
                onClick={() => window.location.href = '/team'}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
              >
                Meet Our Team
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 