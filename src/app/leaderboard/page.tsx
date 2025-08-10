'use client';

import { motion } from 'framer-motion';
import { Trophy, Award, Heart, TrendingUp } from 'lucide-react';
import PageBanner from '@/components/PageBanner';
import Leaderboard from '@/components/Leaderboard';

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50">
      <PageBanner
        title="Top Donors"
        subtitle="Celebrating our community's most generous supporters who are making a real difference in healthcare."
      />

      {/* Stats section removed per request */}

      {/* Leaderboard */}
      <div className="py-16">
        <Leaderboard />
      </div>

      {/* Call to Action */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 text-zinc-900">Join Our Community of Givers</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-zinc-700">
              Every donation, no matter the size, makes a difference. Start your journey of giving 
              and see your name on our leaderboard!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => (window.location.href = '/donate')} className="btn btn-primary px-8 py-3">
                Donate Money
              </button>
              <button onClick={() => (window.location.href = '/donate')} className="inline-flex items-center justify-center rounded-xl border border-emerald-200 px-8 py-3 font-semibold text-emerald-700 hover:bg-emerald-50">
                Donate Items
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 