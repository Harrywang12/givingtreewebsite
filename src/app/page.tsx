'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Leaf, 
  Users, 
  TrendingUp, 
  Mail, 
  Phone,
  MapPin,
  ArrowRight,
  Star,
  Calendar,
  MessageCircle,
  ThumbsUp
} from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">The Giving Tree</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="/mission" className="text-gray-700 hover:text-green-600">Mission</a>
              <a href="/about" className="text-gray-700 hover:text-green-600">About</a>
              <a href="/team" className="text-gray-700 hover:text-green-600">Team</a>
              <a href="/events" className="text-gray-700 hover:text-green-600">Events</a>
              <a href="/donate" className="text-gray-700 hover:text-green-600">Donate</a>
              <a href="/leaderboard" className="text-gray-700 hover:text-green-600">Leaderboard</a>
              <button 
                onClick={handleDashboardClick}
                className="text-gray-700 hover:text-green-600"
              >
                {user ? 'Dashboard' : 'Sign In'}
              </button>
              <a href="#contact" className="text-gray-700 hover:text-green-600">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              The Giving Tree
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Supporting Mackenzie Health through community generosity. 
              Every donation makes a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/donate'}
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Donate Now
              </button>
              <button 
                onClick={() => window.location.href = '/leaderboard'}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
              >
                View Leaderboard
              </button>
            </div>
          </motion.div>
        </div>
      </section>



      {/* Our Approach */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Approach</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Join Our Cause</h3>
                <p className="text-gray-600 mb-4">Make a difference through financial donations</p>
                <button 
                  onClick={() => window.location.href = '/donate'}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Donate Now
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Item Donations</h3>
                <p className="text-gray-600 mb-4">Donate gently used items for resale</p>
                <button 
                  onClick={() => window.location.href = '/donate'}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Donate Items
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Volunteer</h3>
                <p className="text-gray-600 mb-4">Join our team and make an impact</p>
                <button 
                  onClick={handleDashboardClick}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                >
                  {user ? 'Go to Dashboard' : 'Apply Now'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">About Us</h2>
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
            className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg"
          >
            <h3 className="text-2xl font-bold text-center mb-6">What We Do</h3>
            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
              At the Giving Tree Foundation, we transform donated, gently used items into life-changing 
              contributions for our local hospital, Mackenzie Health. Our process is simple but powerful: 
              community members donate items they no longer need, we carefully sort and resell them, and 
              100% of the proceeds go directly to support hospital initiatives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Meet Our Team</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-32 h-32 bg-green-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-16 w-16 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ruogu Qiu</h3>
                <p className="text-gray-600">Co-Founder</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-32 h-32 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-16 w-16 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Justin Wu</h3>
                <p className="text-gray-600">Co-Founder</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Events/News */}
      <section id="events" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Latest News & Events</h2>
            <div className="bg-gray-50 p-8 rounded-lg max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-600">December 2025</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handleLike}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{likes}</span>
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Foundation Launch</h3>
              <p className="text-gray-600 mb-4">
                We're excited to announce the official launch of The Giving Tree Non-Profit Foundation! 
                Join us in our mission to support Mackenzie Health and make a difference in our community.
              </p>
              
              {/* Comments Section */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Comments</h4>
                <div className="space-y-2 mb-4">
                  {comments.map((comment, index) => (
                    <div key={index} className="bg-white p-3 rounded border">
                      <p className="text-sm text-gray-600">{comment}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button 
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
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
      <section id="contact" className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12"
          >
            <div>
              <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3" />
                  <span>Givingtreenonprofit@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3" />
                  <span>Contact us for inquiries</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>Serving Mackenzie Health and surrounding communities</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
              <p className="mb-4">Subscribe to receive the latest updates about our initiatives and impact.</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
                <button 
                  type="submit"
                  className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Leaf className="h-8 w-8 text-green-400" />
                <span className="ml-2 text-xl font-bold">The Giving Tree</span>
              </div>
              <p className="text-gray-400">
                Supporting healthcare through community generosity.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#mission" className="hover:text-white transition-colors">Mission</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#team" className="hover:text-white transition-colors">Team</a></li>
                <li><a href="#events" className="hover:text-white transition-colors">Events</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Get Involved</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Donate</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Volunteer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partner</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-gray-400 mb-2">Givingtreenonprofit@gmail.com</p>
              <p className="text-gray-400">Serving Mackenzie Health</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 The Giving Tree Non-Profit Foundation. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </div>
  );
}
