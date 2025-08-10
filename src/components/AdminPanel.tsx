'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Calendar, 
  Shield, 
  EyeOff,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EventFormData {
  title: string;
  description: string;
  content: string;
  date: string;
  type: 'NEWS' | 'EVENT' | 'ANNOUNCEMENT';
  location: string;
  imageUrl: string;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const { user, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [events, setEvents] = useState([]);
  const [donations, setDonations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'events' | 'donations'>('events');
  
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    content: '',
    date: '',
    type: 'NEWS',
    location: '',
    imageUrl: ''
  });

  // Check if user is admin
  const isAdmin = user?.email === 'wangharrison2009@gmail.com' || user?.email === 'givingtreenonprofit@gmail.com';

  const fetchAdminEvents = async () => {
    try {
      const response = await fetch('/api/admin/events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Error fetching admin events:', error);
    }
  };

  const fetchAdminDonations = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('/api/admin/donations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDonations(data.donations || []);
      }
    } catch (err) {
      console.error('Failed to fetch donations:', err);
    }
  };

  const updateDonationStatus = async (donationId: string, newStatus: string) => {
    if (!token) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/admin/donations/${donationId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setMessage('Donation status updated successfully');
        fetchAdminDonations(); // Refresh the list
      } else {
        setError('Failed to update donation status');
      }
    } catch (err) {
      console.error('Failed to update donation status:', err);
      setError('Failed to update donation status');
    } finally {
      setIsSubmitting(false);
    }
  };

    useEffect(() => {
    if (isOpen && isAdmin) {
      fetchAdminEvents();
      fetchAdminDonations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Event created successfully!');
        setFormData({
          title: '',
          description: '',
          content: '',
          date: '',
          type: 'NEWS',
          location: '',
          imageUrl: ''
        });
        setShowForm(false);
        fetchAdminEvents(); // Refresh the events list
      } else {
        setError(result.error || 'Failed to create event');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg p-6 max-w-md mx-4"
        >
          <div className="flex items-center text-red-600 mb-4">
            <AlertTriangle className="h-6 w-6 mr-2" />
            <h3 className="text-lg font-semibold">Access Denied</h3>
          </div>
          <p className="text-gray-600 mb-4">
            You don't have admin privileges to access this panel.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {user?.email === 'wangharrison2009@gmail.com' ? 'SUPER ADMIN' : 'ADMIN'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success/Error Messages */}
          {message && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-700">{message}</p>
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => {setActiveTab('events'); setShowForm(false);}}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'events'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Events Management
              </button>
              <button
                onClick={() => {setActiveTab('donations'); setShowForm(false);}}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'donations'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Donation Management
              </button>
            </nav>
          </div>

          {activeTab === 'events' && (
            <>
              {/* Event Action Buttons */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Event Management</h3>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  {showForm ? <EyeOff className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  {showForm ? 'Hide Form' : 'Create Event'}
                </button>
              </div>
            </>
          )}

          {activeTab === 'donations' && (
            <>
              {/* Donation Management Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Donation Management</h3>
                <button
                  onClick={fetchAdminDonations}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Refresh
                </button>
              </div>
            </>
          )}

          {/* Create Event Form */}
          {activeTab === 'events' && showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-gray-50 rounded-lg"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      maxLength={200}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter event title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="NEWS">News</option>
                      <option value="EVENT">Event</option>
                      <option value="ANNOUNCEMENT">Announcement</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    maxLength={1000}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of the event"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Content
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    maxLength={5000}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Detailed content (optional)"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="datetime-local"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      maxLength={200}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Event location (optional)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg (optional)"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Creating...' : 'Create Event'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Events List */}
          {activeTab === 'events' && (
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">Recent Events ({events.length})</h4>
            {events.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No events created yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {events.slice(0, 10).map((event: { id: string; title: string; type: string; date: string; commentCount: number; likeCount: number; isActive: boolean }) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{event.title}</h5>
                      <p className="text-sm text-gray-600">{event.type} • {new Date(event.date).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">
                        {event.commentCount || 0} comments • {event.likeCount || 0} likes
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        event.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {event.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={async () => {
                          if (!confirm('Delete this event? This cannot be undone.')) return;
                          try {
                            setIsSubmitting(true);
                            const res = await fetch(`/api/admin/events/${event.id}`, {
                              method: 'DELETE',
                              headers: { 'Authorization': `Bearer ${token}` }
                            });
                            if (res.ok) {
                              setMessage('Event deleted successfully');
                              fetchAdminEvents();
                            } else {
                              const data = await res.json();
                              setError(data.error || 'Failed to delete event');
                            }
                          } catch (err) {
                            console.error('Delete event failed:', err);
                            setError('Failed to delete event');
                          } finally {
                            setIsSubmitting(false);
                          }
                        }}
                        className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        disabled={isSubmitting}
                        aria-label={`Delete event ${event.title}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          )}

          {/* Donations List */}
          {activeTab === 'donations' && (
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">Recent Donations ({donations.length})</h4>
              {donations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No donations found</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {donations.map((donation: { 
                    id: string; 
                    amount: number; 
                    status: string; 
                    paymentMethod: string; 
                    createdAt: string; 
                    user: { name: string; email: string } 
                  }) => (
                    <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium text-gray-900">${donation.amount.toFixed(2)}</h5>
                          <div className="flex items-center space-x-2">
                            <select
                              value={donation.status}
                              onChange={(e) => updateDonationStatus(donation.id, e.target.value)}
                              disabled={isSubmitting}
                              className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="PENDING">Pending</option>
                              <option value="PROCESSING">Processing</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="FAILED">Failed</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              donation.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                              donation.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                              donation.status === 'PENDING' ? 'bg-blue-100 text-blue-800' :
                              donation.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {donation.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {donation.user.name} ({donation.user.email})
                        </p>
                        <p className="text-xs text-gray-500">
                          {donation.paymentMethod} • {new Date(donation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
