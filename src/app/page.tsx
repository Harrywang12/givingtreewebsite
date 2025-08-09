'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  ThumbsUp
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement email subscription
    alert('Thank you for subscribing!');
    setEmail('');
  };

  const handleLike = () => {
    setLikes(prev => prev + 1);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments(prev => [...prev, newComment]);
      setNewComment('');
    }
  };

  const handleDashboardClick = () => {
    if (user) {
      // User is logged in, go directly to dashboard
      router.push('/dashboard');
    } else {
      // User is not logged in, show login modal
      setAuthMode('login');
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50">

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6"
          >
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Community-powered healthcare</span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Growing wellness together with every gift
            </h1>
            <p className="mt-4 text-lg leading-7 text-zinc-600">
              We turn community generosity into tangible support for Mackenzie Health. Your donations fund better care and a healthier future for everyone.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => (window.location.href = '/donate')}
                className="btn btn-primary px-6 py-3"
              >
                Donate Now
              </button>
              <button
                onClick={() => (window.location.href = '/leaderboard')}
                className="inline-flex items-center justify-center rounded-xl border border-emerald-200 px-6 py-3 font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                View Leaderboard
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-6"
          >
            <div className="relative grid grid-cols-2 gap-4 sm:gap-6">
              <div className="col-span-1 space-y-4 sm:space-y-6">
                <div className="overflow-hidden rounded-2xl soft-shadow">
                  <Image
                    src="https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=1200&auto=format&fit=crop"
                    alt="Volunteers sorting donations with smiles"
                    width={600}
                    height={500}
                    className="h-40 w-full object-cover sm:h-56"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl soft-shadow">
                  <Image
                    src="https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=1200&auto=format&fit=crop"
                    alt="Hands holding a small plant as a symbol of growth"
                    width={600}
                    height={500}
                    className="h-28 w-full object-cover sm:h-40"
                  />
                </div>
              </div>
              <div className="col-span-1 space-y-4 sm:space-y-6">
                <div className="overflow-hidden rounded-2xl soft-shadow">
                  <Image
                    src="https://images.unsplash.com/photo-1526250854212-6852f9d64ac2?q=80&w=1200&auto=format&fit=crop"
                    alt="Nurse comforting a patient"
                    width={600}
                    height={500}
                    className="h-28 w-full object-cover sm:h-40"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl soft-shadow">
                  <Image
                    src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop"
                    alt="Community gathering around a table"
                    width={600}
                    height={500}
                    className="h-40 w-full object-cover sm:h-56"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>



      {/* Our Approach */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-zinc-900 mb-8">Our Approach</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="card p-8">
                <h3 className="text-xl font-semibold mb-3">Join Our Cause</h3>
                <p className="text-zinc-600 mb-4">Make a difference through financial donations</p>
                <button 
                  onClick={() => window.location.href = '/donate'}
                  className="btn btn-primary"
                >
                  Donate Now
                </button>
              </div>
              <div className="card p-8">
                <h3 className="text-xl font-semibold mb-3">Item Donations</h3>
                <p className="text-zinc-600 mb-4">Donate gently used items for resale</p>
                <button 
                  onClick={() => window.location.href = '/donate'}
                  className="inline-flex items-center justify-center rounded-xl border border-emerald-200 px-4 py-2 font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  Donate Items
                </button>
              </div>
              <div className="card p-8">
                <h3 className="text-xl font-semibold mb-3">Volunteer</h3>
                <p className="text-zinc-600 mb-4">Join our team and make an impact</p>
                <button 
                  onClick={handleDashboardClick}
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 font-semibold text-white hover:opacity-90"
                >
                  {user ? 'Go to Dashboard' : 'Apply Now'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-zinc-900 mb-8">About Us</h2>
            <div className="max-w-4xl mx-auto text-lg text-zinc-600 leading-relaxed">
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
            className="p-8 rounded-2xl texture-leaf"
          >
            <h3 className="text-2xl font-bold text-center mb-6">What We Do</h3>
            <p className="text-lg text-zinc-600 text-center max-w-3xl mx-auto">
              At the Giving Tree Foundation, we transform donated, gently used items into life-changing 
              contributions for our local hospital, Mackenzie Health. Our process is simple but powerful: 
              community members donate items they no longer need, we carefully sort and resell them, and 
              100% of the proceeds go directly to support hospital initiatives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-zinc-900 mb-8">Meet Our Team</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="card p-8 text-center">
                <div className="w-32 h-32 bg-green-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-16 w-16 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ruogu Qiu</h3>
                <p className="text-zinc-600">Co-Founder</p>
              </div>
              <div className="card p-8 text-center">
                <div className="w-32 h-32 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-16 w-16 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Justin Wu</h3>
                <p className="text-zinc-600">Co-Founder</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Events/News */}
      <section id="events" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-zinc-900 mb-8">Latest News & Events</h2>
            <div className="card p-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-zinc-600">December 2025</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handleLike}
                    className="flex items-center space-x-1 text-zinc-600 hover:text-red-500 transition-colors"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{likes}</span>
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Foundation Launch</h3>
              <p className="text-zinc-600 mb-4">
                We're excited to announce the official launch of The Giving Tree Non-Profit Foundation! 
                Join us in our mission to support Mackenzie Health and make a difference in our community.
              </p>
              
              {/* Comments Section */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Comments</h4>
                <div className="space-y-2 mb-4">
                  {comments.map((comment, index) => (
                    <div key={index} className="bg-white p-3 rounded border">
                      <p className="text-sm text-zinc-600">{comment}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="field"
                  />
                  <button 
                    type="submit"
                    className="btn btn-primary"
                  >
                    Post
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact & Subscribe */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 card p-10"
          >
            <div>
              <h2 className="text-3xl font-bold mb-6 text-zinc-900">Get In Touch</h2>
              <div className="space-y-4">
                <div className="flex items-center text-zinc-700">
                  <Mail className="h-5 w-5 mr-3 text-emerald-600" />
                  <span>Givingtreenonprofit@gmail.com</span>
                </div>
                <div className="flex items-center text-zinc-700">
                  <Phone className="h-5 w-5 mr-3 text-emerald-600" />
                  <span>Contact us for inquiries</span>
                </div>
                <div className="flex items-center text-zinc-700">
                  <MapPin className="h-5 w-5 mr-3 text-emerald-600" />
                  <span>Serving Mackenzie Health and surrounding communities</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-4 text-zinc-900">Stay Updated</h3>
              <p className="mb-4 text-zinc-700">Subscribe to receive the latest updates about our initiatives and impact.</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="field"
                  required
                />
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </div>
  );
}
