'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Heart, 
  DollarSign, 
  Package, 
  TrendingUp,
  Edit,
  LogOut,
  Home,
  Plus,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardDonationForm from './DashboardDonationForm';
import AdminPanel from './AdminPanel';

interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    totalDonated: number;
    itemsDonated: number;
    memberSince: string;
  };
  recentDonations: Array<{
    id: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
  recentItemDonations: Array<{
    id: string;
    items?: string[];
    status: string;
    createdAt: string;
  }>;
  stats: {
    totalMonetary: number;
    totalMonetaryDonations: number;
    totalItemsSold: number;
    pendingItems: number;
  };
}

export default function UserDashboard() {
  const { user, logout, token } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'donations' | 'profile'>('overview');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/user/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          setError('Failed to load dashboard data');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleDonate = () => {
    setShowDonationForm(true);
  };

  const handleAdminPanel = () => {
    setShowAdminPanel(true);
  };

  // Removed unused handleDonationComplete function

  const handleEditProfile = () => {
    if (user) {
      setEditFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      setIsEditingProfile(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditFormData({ name: '', email: '', phone: '' });
  };

  const handleSaveProfile = async () => {
    if (!token) return;
    
    setIsSavingProfile(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });

      if (response.ok) {
        setIsEditingProfile(false);
        // Refresh the dashboard data to get updated user info
        window.location.reload(); // Simple way to refresh user data
      } else {
        setError('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'COMPLETED':
        return 'text-green-600 bg-green-100';
      case 'pending':
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
      case 'PROCESSING':
        return 'text-blue-600 bg-blue-100';
      case 'SOLD':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Use real data if available, otherwise fall back to user data
  const displayUser = dashboardData?.user || user;
  const totalMonetary = dashboardData?.stats.totalMonetary || user.totalDonated || 0;
  const totalItems = dashboardData?.stats.totalItemsSold || user.itemsDonated || 0;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 sm:p-6 rounded-t-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                <User className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">{displayUser.name}</h1>
                <p className="text-green-100 text-sm sm:text-base">Member since {new Date(displayUser.memberSince).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button 
                onClick={handleGoHome}
                className="bg-black bg-opacity-20 text-white px-3 py-2 rounded-lg hover:bg-opacity-30 transition-colors flex items-center border border-white border-opacity-30 text-sm"
              >
                <Home className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Home</span>
              </button>
              <button 
                onClick={handleDonate}
                className="bg-black bg-opacity-20 text-white px-3 py-2 rounded-lg hover:bg-opacity-30 transition-colors flex items-center border border-white border-opacity-30 text-sm"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Donate</span>
              </button>
              {(user?.email === 'wangharrison2009@gmail.com' || user?.email === 'givingtreenonprofit@gmail.com') && (
                <button 
                  onClick={handleAdminPanel}
                  className="bg-blue-600 bg-opacity-80 text-white px-3 py-2 rounded-lg hover:bg-opacity-100 transition-colors flex items-center border border-blue-400 text-sm"
                >
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Admin</span>
                </button>
              )}
              <button 
                onClick={handleLogout}
                className="bg-black bg-opacity-20 text-white px-3 py-2 rounded-lg hover:bg-opacity-30 transition-colors flex items-center border border-white border-opacity-30 text-sm"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 min-w-max">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'donations', label: 'Donations', icon: Heart },
              { id: 'profile', label: 'Profile', icon: User }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'donations' | 'profile')}
                className={`flex items-center py-4 px-2 sm:px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 sm:p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                  <button
                    onClick={handleDonate}
                    className="bg-green-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-sm sm:text-base"
                  >
                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Make a Donation
                  </button>
                  <button
                    onClick={() => router.push('/donate')}
                    className="bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm sm:text-base"
                  >
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Donate Items
                  </button>
                  <button
                    onClick={() => router.push('/events')}
                    className="bg-purple-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center text-sm sm:text-base"
                  >
                    <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    View Events
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-green-50 p-4 sm:p-6 rounded-lg">
                  <div className="flex items-center">
                    <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mr-3 sm:mr-4" />
                    <div>
                      <p className="text-sm text-green-600">Total Donated</p>
                      <p className="text-xl sm:text-2xl font-bold text-green-800">${totalMonetary}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
                  <div className="flex items-center">
                    <Package className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mr-3 sm:mr-4" />
                    <div>
                      <p className="text-sm text-blue-600">Items Donated</p>
                      <p className="text-xl sm:text-2xl font-bold text-blue-800">{totalItems}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 sm:p-6 rounded-lg">
                  <div className="flex items-center">
                    <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mr-3 sm:mr-4" />
                    <div>
                      <p className="text-sm text-purple-600">Total Impact</p>
                      <p className="text-xl sm:text-2xl font-bold text-purple-800">${displayUser.totalDonated || totalMonetary}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {dashboardData?.recentDonations?.slice(0, 3).map((donation) => (
                    <div key={donation.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-green-600 mr-3" />
                        <div>
                          <p className="font-medium">
                            ${donation.amount} donation
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)} self-start sm:self-auto`}>
                        {donation.status.toLowerCase()}
                      </span>
                    </div>
                  ))}
                  {dashboardData?.recentItemDonations?.slice(0, 3).map((donation) => (
                    <div key={donation.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-blue-600 mr-3" />
                        <div>
                          <p className="font-medium">
                            {donation.items?.join(', ') || 'Item donation'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)} self-start sm:self-auto`}>
                        {donation.status.toLowerCase()}
                      </span>
                    </div>
                  ))}
                  {(!dashboardData?.recentDonations?.length && !dashboardData?.recentItemDonations?.length) && (
                    <div className="text-center py-8 text-gray-500">
                      <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No donations yet. Start making a difference today!</p>
                      <button
                        onClick={handleDonate}
                        className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Make Your First Donation
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'donations' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
                <h3 className="text-lg font-semibold">Donation History</h3>
                <button
                  onClick={handleDonate}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center sm:justify-start"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Donation
                </button>
              </div>
              <div className="space-y-4">
                {dashboardData?.recentDonations?.map((donation) => (
                  <div key={donation.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-2 sm:space-y-0">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-medium">Monetary Donation</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)} self-start sm:self-auto`}>
                        {donation.status.toLowerCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Date: {new Date(donation.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm">
                      <span className="text-green-600 font-medium">Amount: ${donation.amount}</span>
                    </div>
                  </div>
                ))}
                {dashboardData?.recentItemDonations?.map((donation) => (
                  <div key={donation.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-2 sm:space-y-0">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-medium">Item Donation</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)} self-start sm:self-auto`}>
                        {donation.status.toLowerCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Date: {new Date(donation.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm">
                      <span className="text-blue-600">Items: {donation.items?.join(', ') || 'Various items'}</span>
                    </div>
                  </div>
                ))}
                {(!dashboardData?.recentDonations?.length && !dashboardData?.recentItemDonations?.length) && (
                  <div className="text-center py-8 text-gray-500">
                    <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No donation history yet. Start making a difference today!</p>
                    <button
                      onClick={handleDonate}
                      className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Make Your First Donation
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
                <h3 className="text-lg font-semibold">Profile Information</h3>
                <button 
                  onClick={handleEditProfile}
                  className="flex items-center text-green-600 hover:text-green-700 self-start sm:self-auto"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
              
              <div className="space-y-4">
                {isEditingProfile ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={editFormData.email}
                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your email address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={editFormData.phone}
                        onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSavingProfile}
                        className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSavingProfile ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="w-full sm:w-auto bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={displayUser.name}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={displayUser.email}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={displayUser.phone || 'Not provided'}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                  <input
                    type="text"
                    value={new Date(displayUser.memberSince).toLocaleDateString()}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Items Donated</label>
                  <input
                    type="text"
                    value={displayUser.itemsDonated?.toString() || totalItems.toString()}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount Donated</label>
                  <input
                    type="text"
                    value={`$${displayUser.totalDonated || totalMonetary}`}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Dashboard Donation Form */}
      <DashboardDonationForm
        isOpen={showDonationForm}
        onClose={() => setShowDonationForm(false)}
      />

      {/* Admin Panel Modal */}
      <AdminPanel
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
      />
    </div>
  );
} 