'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, LogIn } from 'lucide-react';
import UserDashboard from '@/components/UserDashboard';
import AuthModal from '@/components/AuthModal';

export default function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleRegister = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  if (!isLoggedIn) {
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
              <h1 className="text-5xl md:text-6xl font-bold mb-6">My Dashboard</h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                Track your donations, view your impact, and manage your profile
              </p>
            </motion.div>
          </div>
        </div>

        {/* Login Section */}
        <div className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-white rounded-lg shadow-lg p-12 max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome Back</h2>
                <p className="text-gray-600 mb-8">
                  Sign in to your account to view your donation history, track your impact, 
                  and manage your profile.
                </p>
                
                <div className="space-y-4">
                  <button
                    onClick={handleLogin}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In
                  </button>
                  
                  <div className="text-center">
                    <p className="text-gray-600">
                      Don't have an account?{' '}
                      <button
                        onClick={handleRegister}
                        className="text-green-600 hover:text-green-700 font-semibold"
                      >
                        Sign up here
                      </button>
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">What you can do:</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <UserDashboard />
    </div>
  );
} 