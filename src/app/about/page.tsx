'use client';

import { motion } from 'framer-motion';
import { Heart, Users, Leaf } from 'lucide-react';
import Image from 'next/image';
import PageBanner from '@/components/PageBanner';

export default function AboutPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <PageBanner
        title="About Us"
        subtitle="Turning generosity into tangible support for healthcare in our community"
      />

      {/* About Us Content */}
      <section className="py-24 relative">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center justify-center mb-6">
              <span className="inline-block h-0.5 w-10 bg-green-300 mr-3"></span>
              <span className="text-green-600 font-medium uppercase tracking-wider text-sm">Our Journey</span>
              <span className="inline-block h-0.5 w-10 bg-green-300 ml-3"></span>
            </div>
            
            <h2 className="text-4xl font-bold text-green-900 mb-10 font-serif">Our Story</h2>
            
            <div className="max-w-4xl mx-auto text-lg text-green-800 leading-relaxed">
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="card p-10 mb-20 relative overflow-hidden"
          >
            {/* Leaf decoration */}
            <div className="absolute -top-10 -right-10 w-40 h-40 opacity-10 pointer-events-none">
              <Image 
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234caf50'%3E%3Cpath d='M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C16 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z'/%3E%3C/svg%3E"
                width={160}
                height={160}
                alt=""
              />
            </div>
            
            <h3 className="text-2xl font-bold text-center mb-6 text-green-900 font-serif">What We Do</h3>
            <p className="text-lg text-green-700 text-center max-w-3xl mx-auto leading-relaxed">
              At the Giving Tree Foundation, we transform donated, gently used items into life-changing 
              contributions for our local hospital, Mackenzie Health. Our process is simple but powerful: 
              community members donate items they no longer need, we carefully sort and resell them, and 
              100% of the proceeds go directly to support hospital initiatives.
            </p>
          </motion.div>

          {/* Our Process */}
          <h3 className="text-3xl font-bold text-green-900 text-center mb-12 font-serif">Our Process</h3>
          
          <div className="grid md:grid-cols-3 gap-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="card p-8 text-center relative overflow-hidden"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100/50">
                  <Heart className="h-10 w-10 text-green-600" />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-200/30 to-transparent rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-green-900">1. Collect Donations</h3>
                <p className="text-green-700">
                  Community members donate gently used items they no longer need, supporting sustainability and healthcare.
                </p>
              </div>
              
              {/* Subtle background decoration */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-100 rounded-full opacity-50 z-0"></div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="card p-8 text-center relative overflow-hidden transform md:translate-y-4"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100/50">
                  <Users className="h-10 w-10 text-green-600" />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-200/30 to-transparent rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-green-900">2. Sort & Resell</h3>
                <p className="text-green-700">
                  We carefully sort items and connect them with new owners, extending their useful life.
                </p>
              </div>
              
              {/* Subtle background decoration */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-100 rounded-full opacity-50 z-0"></div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true, margin: "-100px" }}
              className="card p-8 text-center relative overflow-hidden"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100/50">
                  <Leaf className="h-10 w-10 text-green-600" />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-200/30 to-transparent rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-green-900">3. Support Healthcare</h3>
                <p className="text-green-700">
                  100% of proceeds go directly to Mackenzie Health initiatives, improving care for everyone.
                </p>
              </div>
              
              {/* Subtle background decoration */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-100 rounded-full opacity-50 z-0"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-green-50 relative overflow-hidden">
        {/* Leaf pattern background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='96' viewBox='0 0 60 96'%3E%3Cg fill='%234caf50' fill-opacity='0.3'%3E%3Cpath d='M36 10a6 6 0 0 1 12 0v12a6 6 0 0 1-12 0V10zm24 78a6 6 0 0 1-6 6h-12a6 6 0 0 1 0-12h12a6 6 0 0 1 6 6zM4 72a6 6 0 0 1-4-10l8-8a6 6 0 0 1 8 8l-8 8a5.9 5.9 0 0 1-4 2zm54-8a6 6 0 0 1 0-12h12a6 6 0 0 1 0 12H58zm-48 0a6 6 0 0 1 0-12H22a6 6 0 0 1 0 12H10zM32 58a6 6 0 0 1-12 0V46a6 6 0 0 1 12 0v12zm24-42a6 6 0 0 1-6 6H38a6 6 0 0 1 0-12h12a6 6 0 0 1 6 6zm-48 0a6 6 0 0 1-6 6H0a6 6 0 0 1 0-12h2a6 6 0 0 1 6 6z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 96px'
          }}>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-white rounded-xl p-10 shadow-lg"
          >
            <h2 className="text-3xl font-bold mb-6 text-green-900 font-serif">Join Our Community</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-green-700 leading-relaxed">
              Be part of our mission to support Mackenzie Health and make a difference in healthcare.
              Together, we can create a healthier future for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <a href="/donate" className="btn btn-primary px-8 py-3">
                Make a Donation
              </a>
              <a href="/team" className="btn btn-secondary px-8 py-3">
                Meet Our Team
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 