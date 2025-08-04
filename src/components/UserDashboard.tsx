'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Heart, 
  Calendar, 
  DollarSign, 
  Package, 
  TrendingUp,
  Edit,
  LogOut
} from 'lucide-react';

interface Donation {
  id: number;
  date: string;
  type: 'monetary' | 'item';
  amount?: number;
  items?: string[];
  status: 'completed' | 'pending' | 'processing';
}

const mockDonations: Donation[] = [
  {
    id: 1,
    date: '2025-12-15',
    type: 'monetary',
    amount: 250,
    status: 'completed'
  },
  {
    id: 2,
    date: '2025-12-10',
    type: 'item',
    items: ['Coffee Table', 'Bookshelf'],
    status: 'completed'
  },
  {
    id: 3,
    date: '2025-12-05',
    type: 'monetary',
    amount: 100,
    status: 'completed'
  },
  {
    id: 4,
    date: '2025-12-01',
    type: 'item',
    items: ['Laptop', 'Monitor'],
    status: 'pending'
  }
];

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'donations' | 'profile'>('overview');
  const [user] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    totalDonations: 350,
    itemsDonated: 4,
    memberSince: '2025-09-01'
  });

  const totalMonetary = mockDonations
    .filter(d => d.type === 'monetary' && d.status === 'completed')
    .reduce((sum, d) => sum + (d.amount || 0), 0);

  const totalItems = mockDonations
    .filter(d => d.type === 'item' && d.status === 'completed')
    .reduce((sum, d) => sum + (d.items?.length || 0), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-green-100">Member since {new Date(user.memberSince).toLocaleDateString()}</p>
              </div>
            </div>
            <button className="bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'donations', label: 'Donations', icon: Heart },
              { id: 'profile', label: 'Profile', icon: User }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-green-600 mr-4" />
                    <div>
                      <p className="text-sm text-green-600">Total Donated</p>
                      <p className="text-2xl font-bold text-green-800">${totalMonetary}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <Package className="h-8 w-8 text-blue-600 mr-4" />
                    <div>
                      <p className="text-sm text-blue-600">Items Donated</p>
                      <p className="text-2xl font-bold text-blue-800">{totalItems}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <Heart className="h-8 w-8 text-purple-600 mr-4" />
                    <div>
                      <p className="text-sm text-purple-600">Total Impact</p>
                      <p className="text-2xl font-bold text-purple-800">${user.totalDonations}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {mockDonations.slice(0, 3).map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        {donation.type === 'monetary' ? (
                          <DollarSign className="h-5 w-5 text-green-600 mr-3" />
                        ) : (
                          <Package className="h-5 w-5 text-blue-600 mr-3" />
                        )}
                        <div>
                          <p className="font-medium">
                            {donation.type === 'monetary' 
                              ? `$${donation.amount} donation`
                              : `${donation.items?.join(', ')} donated`
                            }
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(donation.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                        {donation.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'donations' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Donation History</h3>
              <div className="space-y-4">
                {mockDonations.map((donation) => (
                  <div key={donation.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {donation.type === 'monetary' ? (
                          <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                        ) : (
                          <Package className="h-5 w-5 text-blue-600 mr-2" />
                        )}
                        <span className="font-medium">
                          {donation.type === 'monetary' ? 'Monetary Donation' : 'Item Donation'}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                        {donation.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Date: {new Date(donation.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm">
                      {donation.type === 'monetary' ? (
                        <span className="text-green-600 font-medium">Amount: ${donation.amount}</span>
                      ) : (
                        <span className="text-blue-600">Items: {donation.items?.join(', ')}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Profile Information</h3>
                <button className="flex items-center text-green-600 hover:text-green-700">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={user.name}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={user.phone}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                  <input
                    type="text"
                    value={new Date(user.memberSince).toLocaleDateString()}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
} 