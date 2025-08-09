'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, LogIn } from 'lucide-react';
import PageBanner from '@/components/PageBanner';
import UserDashboard from '@/components/UserDashboard';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      // User is logged in, show dashboard
      setShowAuthModal(false);
    }
  }, [user, isLoading]);

  const handleLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleRegister = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  // Removed unused function

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, show the dashboard
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50">
        <PageBanner title="My Dashboard" subtitle="Track your donations, view your impact, and manage your profile." />
        <div className="pt-8">
          <UserDashboard />
        </div>
      </div>
    );
  }

  // If user is not logged in, show the login page
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50">
      <PageBanner title="My Dashboard" subtitle="Track your donations, view your impact, and manage your profile." />

      {/* Login Section */}
      <div className="py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="card p-6 sm:p-12 max-w-2xl mx-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-4">Welcome Back</h2>
              <p className="text-zinc-600 mb-8 text-sm sm:text-base">
                Sign in to your account to view your donation history, track your impact, 
                and manage your profile.
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={handleLogin}
                  className="w-full btn btn-primary py-3 font-semibold flex items-center justify-center text-sm sm:text-base"
                >
                  <LogIn className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Sign In
                </button>
                
                <div className="text-center">
                  <p className="text-zinc-600 text-sm sm:text-base">
                    Don&apos;t have an account?{' '}
                    <button
                      onClick={handleRegister}
                      className="text-emerald-700 hover:text-emerald-800 font-semibold"
                    >
                      Sign up here
                    </button>
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-zinc-900 mb-4">What you can do:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-zinc-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Track donations
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    View impact
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Manage profile
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </div>
  );
} 