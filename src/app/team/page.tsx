'use client';

import { motion } from 'framer-motion';
import { Users, Heart } from 'lucide-react';
import Image from 'next/image';
import PageBanner from '@/components/PageBanner';

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50">
      <PageBanner title="Meet Our Team" subtitle="The passionate individuals behind The Giving Tree Foundation" />

      {/* Team Members */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-zinc-900 mb-8">Our Founders</h2>
            <p className="text-xl text-zinc-600 max-w-3xl mx-auto">
              Meet the visionaries who founded The Giving Tree Foundation with a mission to support 
              healthcare through community generosity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Ruogu Qiu */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="card p-8 text-center"
            >
              <div className="w-32 h-32 bg-green-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="h-16 w-16 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">Ruogu Qiu</h3>
              <p className="text-emerald-700 font-semibold mb-4">Co-Founder</p>
              <p className="text-zinc-600 mb-6">
                Ruogu brings a deep passion for community service and sustainable practices. 
                With a background in healthcare advocacy, Ruogu envisioned a way to connect 
                community generosity with tangible healthcare improvements.
              </p>
            </motion.div>

            {/* Justin Wu */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="card p-8 text-center"
            >
              <div className="w-32 h-32 bg-blue-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="h-16 w-16 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">Justin Wu</h3>
              <p className="text-blue-700 font-semibold mb-4">Co-Founder</p>
              <p className="text-zinc-600 mb-6">
                Justin combines strategic thinking with a commitment to social impact. 
                His expertise in operations and community engagement has been instrumental 
                in building the foundation's sustainable donation model.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Executives Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-zinc-900 mb-8">Executives</h2>
            <p className="text-xl text-zinc-600 max-w-3xl mx-auto">
              Our executive team leading the foundation's strategic direction and operations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Harrison Wang */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="card p-8 text-center"
            >
              <div className="w-32 h-32 bg-purple-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="h-16 w-16 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">Harrison Wang</h3>
              <p className="text-purple-700 font-semibold mb-4">CTO</p>
              <p className="text-zinc-600 mb-6">
                Leading the technical vision and digital infrastructure to create seamless 
                experiences that connect donors, volunteers, and healthcare communities.
              </p>
            </motion.div>

            {/* Leo Zeng */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="card p-8 text-center"
            >
              <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden relative">
                <Image
                  src="/leozeng.JPG"
                  alt="Leo Zeng"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">Leo Zeng</h3>
              <p className="text-emerald-700 font-semibold mb-4">Pickering Head of Operations</p>
              <p className="text-zinc-600 mb-6">
                Leo brings operational expertise and strategic planning to ensure the foundation 
                runs efficiently and effectively serves our community.
              </p>
            </motion.div>

            {/* Rui Zeng */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="card p-8 text-center"
            >
              <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden relative">
                <Image
                  src="/ruizeng.JPG"
                  alt="Rui Zeng"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">Rui Zeng</h3>
              <p className="text-blue-700 font-semibold mb-4">Pickering Head of Operations</p>
              <p className="text-zinc-600 mb-6">
                Rui is committed to streamlining operations and enhancing our ability to make 
                a meaningful impact in the Pickering community.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 dark:text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Values</h2>
            <p className="text-xl text-gray-600 dark:text-gray-700 max-w-3xl mx-auto">
              The principles that guide everything we do at The Giving Tree Foundation
            </p>
          </motion.div>

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
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Compassion</h3>
              <p className="text-gray-700 dark:text-gray-800">
                We approach every interaction with empathy and understanding, 
                recognizing the impact of healthcare on individuals and families.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-700 dark:text-gray-800">
                We believe in the power of collective action and the strength 
                that comes from working together for a common cause.
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
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Transparency</h3>
              <p className="text-gray-700 dark:text-gray-800">
                We maintain complete transparency in our operations, ensuring 
                donors know exactly how their contributions make a difference.
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
            <h2 className="text-3xl font-bold mb-6">Join Our Team</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              We're always looking for passionate individuals to help us grow our impact. 
              Consider volunteering or partnering with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/donate'}
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Make a Donation
              </button>
              <a 
                href="/volunteer"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
              >
                Volunteer With Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 