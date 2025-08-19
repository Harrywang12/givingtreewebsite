'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Heart, User, UserX, ArrowRight, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';

function DonationChoiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // If user is already logged in, redirect them directly to donation page
  useEffect(() => {
    if (user && token) {
      router.push('/donate');
    }
  }, [user, token, router]);

  const handleAnonymousDonation = () => {
    setIsRedirecting(true);
    // Redirect to donation page for anonymous users
    router.push('/donate?anonymous=true');
  };

  const handleLoginToDonate = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleRegisterToDonate = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleGoBack = () => {
    router.push('/');
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Redirect to donation page after successful authentication
    router.push('/donate');
  };

  // If redirecting, show loading
  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-800">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-green-900 mb-6 font-serif">Choose Your Donation Path</h1>
            <p className="text-lg text-green-800 max-w-3xl mx-auto">
              You can donate anonymously or log in to track your contributions and appear on our leaderboard.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Anonymous Donation Option */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserX className="h-8 w-8 text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Donate Anonymously</h2>
                <p className="text-gray-600 mb-6">
                  Make a donation without creating an account. Your contribution will still be tracked and you may qualify for our leaderboard.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>No account required</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>May qualify for leaderboard</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>100% goes to Mackenzie Health</span>
                </div>
              </div>

              <button
                onClick={handleAnonymousDonation}
                className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center justify-center"
              >
                <span>Continue Anonymously</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </motion.div>

            {/* Login to Donate Option */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-2 border-green-200"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-900 mb-3">Log In to Donate</h2>
                <p className="text-green-700 mb-6">
                  Create an account or log in to track your donations, view your history, and compete on our leaderboard.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center text-sm text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Track all your donations</span>
                </div>
                <div className="flex items-center text-sm text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>View donation history</span>
                </div>
                <div className="flex items-center text-sm text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Compete on leaderboard</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleLoginToDonate}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  <span>Log In</span>
                </button>
                
                <button
                  onClick={handleRegisterToDonate}
                  className="w-full bg-green-100 text-green-700 py-3 px-4 rounded-lg font-medium hover:bg-green-200 transition-colors flex items-center justify-center"
                >
                  <User className="h-5 w-5 mr-2" />
                  <span>Create Account</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <button
              onClick={handleGoBack}
              className="text-green-700 hover:text-green-800 font-medium flex items-center justify-center mx-auto"
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Back to Home
            </button>
          </motion.div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto"
          >
            <div className="text-center mb-6">
              <Heart className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-green-900">Why Choose to Log In?</h3>
            </div>
            
            <div className="prose max-w-none text-gray-700">
              <p className="text-center mb-4">
                While anonymous donations are always welcome, creating an account gives you:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Personal Dashboard</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• View all your donation history</li>
                    <li>• Track your impact over time</li>
                    <li>• Manage your profile</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Community Features</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Compete on the leaderboard</li>
                    <li>• Earn recognition for your generosity</li>
                    <li>• Connect with other donors</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-center mt-6 text-sm text-gray-600">
                Remember: 100% of all donations, whether anonymous or tracked, go directly to supporting Mackenzie Health.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSuccess={handleAuthSuccess}
        redirectTo="/donate"
      />
    </>
  );
}

export default function DonationChoicePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-800">Loading donation choice page...</p>
        </div>
      </div>
    }>
      <DonationChoiceContent />
    </Suspense>
  );
}
