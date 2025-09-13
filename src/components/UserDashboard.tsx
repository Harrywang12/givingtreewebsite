'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Heart, 
  Package, 
  TrendingUp,
  Edit,
  LogOut,
  Home,
  Plus,
  Shield,
  Trash2,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardDonationForm from './DashboardDonationForm';
import AdminPanel from './AdminPanel';
import ProfilePicture from './ProfilePicture';
import Link from 'next/link';

interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string | null;
    totalDonated: number;
    itemsDonated: number;
    memberSince: string;
  };
  recentItemDonations: Array<{
    id: string;
    items?: string[];
    status: string;
    createdAt: string;
  }>;
  // stats removed from UI use
  stats: {
    totalMonetary: number;
    totalMonetaryDonations: number;
    totalItemsSold: number;
    pendingItems: number;
  };
  totalItemsDonated: number;
  totalEventsAttended: number;
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
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [message, setMessage] = useState('');

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
    router.push('/donate');
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

  const handleProfilePictureUpload = async (file: File) => {
    if (!token) return;
    
    setIsUploadingPicture(true);
    setError(''); // Clear any previous errors
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/user/profile/picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(result.message || 'Profile picture updated successfully!');
        
        // Update the local user state to show the new picture immediately
        if (user) {
          // This is a temporary update - the real path will come from the server
          // For now, we'll reload to get the actual data
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to upload profile picture');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setError('Failed to upload profile picture');
    } finally {
      setIsUploadingPicture(false);
    }
  };

  const handleDeleteProfilePicture = async () => {
    if (!token) return;
    
    setIsUploadingPicture(true);
    try {
      const response = await fetch('/api/user/profile/picture', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Refresh the dashboard data to get updated user info
        window.location.reload();
      } else {
        setError('Failed to remove profile picture');
      }
    } catch (error) {
      console.error('Error removing profile picture:', error);
      setError('Failed to remove profile picture');
    } finally {
      setIsUploadingPicture(false);
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
  const totalItems = dashboardData?.user?.itemsDonated || 0;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg"
      >
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-700 to-green-500 text-white p-4 sm:p-6 rounded-t-lg">
          {/* Decorative organic shapes */}
          <div className="pointer-events-none absolute -top-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <div className="mr-3 sm:mr-4">
                <ProfilePicture 
                  src={dashboardData?.user?.avatar || user?.avatar} 
                  alt={displayUser?.name || 'User'} 
                  size="md" 
                />
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

        {/* Success/Error Messages */}
        {message && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg mx-4 mt-4 flex items-center">
            <div className="w-5 h-5 bg-green-500 rounded-full mr-3 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <p className="text-green-700">{message}</p>
            <button
              onClick={() => setMessage('')}
              className="ml-auto text-green-500 hover:text-green-700"
            >
              ×
            </button>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mx-4 mt-4 flex items-center">
            <div className="w-5 h-5 bg-red-500 rounded-full mr-3 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError('')}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex px-4 sm:px-6 min-w-max">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'donations', label: 'Donations', icon: Heart },
              { id: 'profile', label: 'Profile', icon: User }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'donations' | 'profile')}
                className={`flex items-center py-4 px-3 sm:px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
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
              <div className="card card-highlight p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                  <button
                    onClick={handleDonate}
                    className="btn btn-primary flex items-center justify-center sm:justify-start"
                  >
                    <Package className="h-5 w-5 mr-2" />
                    Make a Donation
                  </button>
                  <button
                    onClick={() => router.push('/donate')}
                    className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-3 font-semibold text-white hover:opacity-90"
                  >
                    <Package className="h-5 w-5 mr-2" />
                    Donate Items
                  </button>
                  <button
                    onClick={() => router.push('/announcements')}
                    className="inline-flex items-center justify-center rounded-xl border border-emerald-200 px-4 py-3 font-semibold text-emerald-700 hover:bg-emerald-50"
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    View Updates
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="card p-4 sm:p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Package className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Items Donated</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardData?.user?.itemsDonated || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="card p-4 sm:p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Events Attended</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardData?.totalEventsAttended || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Donation tracking removed for now - keeping code structure */}
              {/* 
              <div className="card p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Donation Progress</h3>
                  <span className="text-sm text-gray-500">This month</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Donated</span>
                    <span className="text-lg font-semibold text-purple-800">${displayUser.totalDonated || totalMonetary}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((displayUser.totalDonated || totalMonetary) / 1000 * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">Goal: $1,000</p>
                </div>
              </div>
              */}

              {/* Recent Activity */}
              <div className="card p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Recent Activity</h3>
                  <Link href="/donate" className="text-sm text-green-600 hover:text-green-700 font-medium">
                    View All
                  </Link>
                </div>
                
                {dashboardData?.recentItemDonations && dashboardData.recentItemDonations.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recentItemDonations.slice(0, 5).map((donation) => (
                      <div key={donation.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <Package className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            Item Donation
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            donation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            donation.status === 'SOLD' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {donation.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No recent item donations</p>
                    <Link
                      href="/donate"
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Donate Items
                    </Link>
                  </div>
                )}
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
                {dashboardData?.recentItemDonations?.map((donation) => (
                  <div key={donation.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-2 sm:space-y-0">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-medium">Item Donation</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        donation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        donation.status === 'SOLD' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      } self-start sm:self-auto`}>
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
                {(!dashboardData?.recentItemDonations?.length) && (
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
                {/* Profile Picture Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Profile Picture</label>
                  <div className="flex items-center space-x-4">
                    <ProfilePicture 
                      src={dashboardData?.user?.avatar || user?.avatar} 
                      alt={displayUser?.name || 'User'} 
                      size="lg"
                      editable={!isEditingProfile}
                      onUpload={handleProfilePictureUpload}
                      isLoading={isUploadingPicture}
                    />
                    {!isEditingProfile && dashboardData?.user?.avatar && (
                      <button
                        onClick={handleDeleteProfilePicture}
                        disabled={isUploadingPicture}
                        className="flex items-center text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                
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
                {/* Donation amount tracking removed for now - keeping code structure */}
                {/*
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount Donated</label>
                  <input
                    type="text"
                    value={`$${displayUser.totalDonated || totalMonetary}`}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                */}
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