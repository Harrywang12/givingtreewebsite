'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Plus, 
  Calendar, 
  Shield, 
  EyeOff,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Heart,
  Trash2,
  Package
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import logger from '@/lib/logger';

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
  imageFile?: File;
}

interface DonorFormData {
  name: string;
  isAnonymous: boolean;
  amount: string;
  itemDonated: string;
  message: string;
}

interface Donor {
  id: string;
  name: string;
  isAnonymous: boolean;
  amount?: number;
  itemDonated?: string;
  message?: string;
  isActive: boolean;
  createdAt: string;
}

interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  category?: string;
  condition?: string;
  imageUrl?: string;
  isAvailable: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const { user, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [events, setEvents] = useState([]);
  const [donations, setDonations] = useState([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'events' | 'donations' | 'donors' | 'inventory'>('events');
  
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    content: '',
    date: '',
    type: 'NEWS',
    location: '',
    imageUrl: '',
    imageFile: undefined
  });

  const [donorFormData, setDonorFormData] = useState<DonorFormData>({
    name: '',
    isAnonymous: false,
    amount: '',
    itemDonated: '',
    message: ''
  });
  
  // State to manage multiple image upload fields
  const [imageUploadFields, setImageUploadFields] = useState<{id: number, file: File | null}[]>([
    { id: 1, file: null }
  ]);

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
      logger.error('Error fetching admin events:', error);
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
      logger.error('Failed to fetch donations:', err);
    }
  };

  const updateDonationStatus = async (donationId: string, newStatus: string) => {
    if (!token) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/admin/donations/status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ donationId, status: newStatus })
      });
      
      if (response.ok) {
        setMessage('Donation status updated successfully');
        fetchAdminDonations(); // Refresh the list
      } else {
        setError('Failed to update donation status');
      }
    } catch (err) {
      logger.error('Failed to update donation status:', err);
      setError('Failed to update donation status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchAdminDonors = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('/api/admin/donors', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDonors(data.donors || []);
      }
    } catch (err) {
      logger.error('Failed to fetch donors:', err);
    }
  };

  const handleDonorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/admin/donors', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(donorFormData)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Donor added successfully');
        setDonorFormData({
          name: '',
          isAnonymous: false,
          amount: '',
          itemDonated: '',
          message: ''
        });
        fetchAdminDonors(); // Refresh the list
      } else {
        setError(result.error || 'Failed to add donor');
      }
    } catch (err) {
      logger.error('Failed to add donor:', err);
      setError('Failed to add donor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteDonor = async (donorId: string) => {
    if (!token || !confirm('Are you sure you want to remove this donor?')) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/admin/donors/${donorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setMessage('Donor removed successfully');
        fetchAdminDonors(); // Refresh the list
      } else {
        setError('Failed to remove donor');
      }
    } catch (err) {
      logger.error('Failed to remove donor:', err);
      setError('Failed to remove donor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchAdminInventory = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('/api/admin/inventory', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setInventoryItems(data.items || []);
      }
    } catch (err) {
      logger.error('Failed to fetch inventory:', err);
    }
  };
  
  // Add a new image upload field
  const addImageUploadField = () => {
    const newId = imageUploadFields.length > 0 
      ? Math.max(...imageUploadFields.map(field => field.id)) + 1 
      : 1;
    
    setImageUploadFields([...imageUploadFields, { id: newId, file: null }]);
  };
  
  // Remove an image upload field
  const removeImageUploadField = (id: number) => {
    setImageUploadFields(imageUploadFields.filter(field => field.id !== id));
  };
  
  // Handle file selection for a specific upload field
  const handleFileChange = (id: number, file: File | null) => {
    setImageUploadFields(
      imageUploadFields.map(field => 
        field.id === id ? { ...field, file } : field
      )
    );
  };

  const handleInventorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      // Get all files from the upload fields
      const files = imageUploadFields
        .map(field => field.file)
        .filter((file): file is File => file !== null);
      
      if (files.length === 0) {
        setError('Please select at least one image to upload');
        setIsSubmitting(false);
        return;
      }
      
      let successCount = 0;
      
      // Process each image sequentially
      for (const imageFile of files) {
        const formDataToSend = new FormData();
        formDataToSend.append('imageFile', imageFile);
        
        const response = await fetch('/api/admin/inventory', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataToSend
        });
        
        if (response.ok) {
          successCount++;
        }
      }
      
      if (successCount > 0) {
        setMessage(`${successCount} inventory items added successfully`);
        
        // Reset form
        setImageUploadFields([{ id: 1, file: null }]);
        fetchAdminInventory(); // Refresh the list
      } else {
        setError('Failed to add any inventory items');
      }
    } catch (err) {
      logger.error('Failed to add inventory item:', err);
      setError('Failed to add inventory item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteInventoryItem = async (itemId: string) => {
    if (!token || !confirm('Are you sure you want to remove this inventory item?')) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/admin/inventory/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setMessage('Inventory item removed successfully');
        fetchAdminInventory(); // Refresh the list
      } else {
        setError('Failed to remove inventory item');
      }
    } catch (err) {
      logger.error('Failed to remove inventory item:', err);
      setError('Failed to remove inventory item');
    } finally {
      setIsSubmitting(false);
    }
  };

    useEffect(() => {
    if (isOpen && isAdmin) {
      fetchAdminEvents();
      fetchAdminDonations();
      fetchAdminDonors();
      fetchAdminInventory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      let response;
      
      if (formData.imageFile) {
        // Handle file upload
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('content', formData.content);
        formDataToSend.append('date', formData.date);
        formDataToSend.append('type', formData.type);
        formDataToSend.append('location', formData.location);
        formDataToSend.append('imageFile', formData.imageFile);
        formDataToSend.append('imageUrl', formData.imageUrl || ''); // Always include imageUrl
        
        logger.log('🔍 Frontend debug - sending FormData:');
        logger.log('- imageFile:', formData.imageFile);
        logger.log('- imageUrl:', formData.imageUrl);
        logger.log('- FormData keys:', Array.from(formDataToSend.keys()));
        
        response = await fetch('/api/admin/events', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataToSend
        });
      } else {
        // Handle text-only submission
        logger.log('🔍 Frontend debug - sending JSON:');
        logger.log('- imageUrl:', formData.imageUrl);
        
        response = await fetch('/api/admin/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            content: formData.content,
            date: formData.date,
            type: formData.type,
            location: formData.location,
            imageUrl: formData.imageUrl
          })
        });
      }

      const result = await response.json();

      if (response.ok) {
        setMessage('Content created successfully!');
        setFormData({
          title: '',
          description: '',
          content: '',
          date: '',
          type: 'NEWS',
          location: '',
          imageUrl: '',
          imageFile: undefined
        });
        setShowForm(false);
        fetchAdminEvents(); // Refresh the content list
      } else {
        setError(result.error || 'Failed to create content');
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

  const handleEventFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        imageUrl: URL.createObjectURL(file)
      }));
      
      // Clear any previous errors
      setError('');
    }
  };

  const clearImage = () => {
    setFormData(prev => ({
      ...prev,
      imageFile: undefined,
      imageUrl: ''
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
                Content Management
              </button>
              <button
                onClick={() => {setActiveTab('donors'); setShowForm(false);}}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'donors'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Heart className="h-4 w-4 inline mr-1" />
                Donors
              </button>
              <button
                onClick={() => {setActiveTab('inventory'); setShowForm(false);}}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'inventory'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Package className="h-4 w-4 inline mr-1" />
                Inventory
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
                <h3 className="text-lg font-semibold text-gray-900">Content Management</h3>
                                  <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    {showForm ? <EyeOff className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    {showForm ? 'Hide Form' : 'Create Content'}
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
                      Content Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      maxLength={200}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter content title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Type *
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
                    placeholder="Brief description of the content"
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
                      type="date"
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
                      placeholder="Event location (optional for events)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Upload
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      name="imageFile"
                      accept="image/*"
                      onChange={handleEventFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500">Accepted formats: JPG, PNG, GIF. Max size: 5MB</p>
                    
                    {formData.imageUrl && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-600">Preview:</p>
                          <button
                            type="button"
                            onClick={clearImage}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Remove Image
                          </button>
                        </div>
                        {formData.imageUrl.startsWith('blob:') ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img 
                            src={formData.imageUrl} 
                            alt="Preview" 
                            className="w-32 h-32 object-cover rounded-lg border"
                          />
                        ) : (
                          <Image
                            src={formData.imageUrl}
                            alt="Preview"
                            width={128}
                            height={128}
                            className="w-32 h-32 object-cover rounded-lg border"
                          />
                        )}
                        {formData.imageFile && (
                          <p className="text-xs text-gray-500 mt-1">
                            File: {formData.imageFile.name} ({(formData.imageFile.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Or enter image URL directly:
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
                  </div>
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
                    {isSubmitting ? 'Creating...' : 'Create Content'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Events List */}
          {activeTab === 'events' && (
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">Recent Content ({events.length})</h4>
            {events.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No content created yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {events.slice(0, 10).map((event: { id: string; title: string; type: string; date: string; commentCount: number; likeCount: number; isActive: boolean; imageUrl?: string }) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 flex items-center space-x-3">
                      {/* Event Image Thumbnail */}
                      {event.imageUrl && (
                        <div className="flex-shrink-0">
                          <Image
                            src={event.imageUrl}
                            alt={event.title}
                            width={48}
                            height={48}
                            className="w-12 h-12 object-cover rounded-lg border"
                            onError={(e) => {
                              // Hide image if it fails to load
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{event.title}</h5>
                        <p className="text-sm text-gray-600">{event.type} • {new Date(event.date).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">
                          {event.commentCount || 0} comments • {event.likeCount || 0} likes
                        </p>
                      </div>
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
                          if (!confirm('Delete this content? This cannot be undone.')) return;
                          try {
                            setIsSubmitting(true);
                            const res = await fetch(`/api/admin/events/${event.id}`, {
                              method: 'DELETE',
                              headers: { 'Authorization': `Bearer ${token}` }
                            });
                            if (res.ok) {
                              setMessage('Content deleted successfully');
                              fetchAdminEvents();
                            } else {
                              const data = await res.json();
                              setError(data.error || 'Failed to delete content');
                            }
                          } catch (err) {
                            logger.error('Delete content failed:', err);
                            setError('Failed to delete content');
                          } finally {
                            setIsSubmitting(false);
                          }
                        }}
                        className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        disabled={isSubmitting}
                        aria-label={`Delete content ${event.title}`}
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

          {/* Donors Management */}
          {activeTab === 'donors' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-md font-semibold text-gray-900">Donor Management ({donors.length})</h4>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Donor
                </button>
              </div>

              {/* Add Donor Form */}
              {showForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-900 mb-4">Add New Donor</h5>
                  <form onSubmit={handleDonorSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Donor Name *
                        </label>
                        <input
                          type="text"
                          value={donorFormData.name}
                          onChange={(e) => setDonorFormData({...donorFormData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Enter donor name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Donation Amount
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={donorFormData.amount}
                          onChange={(e) => setDonorFormData({...donorFormData, amount: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Item Donated
                      </label>
                      <input
                        type="text"
                        value={donorFormData.itemDonated}
                        onChange={(e) => setDonorFormData({...donorFormData, itemDonated: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., Furniture, Electronics, Books, etc."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thank You Message
                      </label>
                      <textarea
                        value={donorFormData.message}
                        onChange={(e) => setDonorFormData({...donorFormData, message: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows={3}
                        placeholder="Optional thank you message from the donor"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isAnonymous"
                        checked={donorFormData.isAnonymous}
                        onChange={(e) => setDonorFormData({...donorFormData, isAnonymous: e.target.checked})}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isAnonymous" className="ml-2 block text-sm text-gray-700">
                        Anonymous donor
                      </label>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        {isSubmitting ? 'Adding...' : 'Add Donor'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Donors List */}
              {donors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Heart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No donors added yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {donors.map((donor) => (
                    <div key={donor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium text-gray-900">
                            {donor.isAnonymous ? 'Anonymous Donor' : donor.name}
                          </h5>
                          <div className="flex items-center space-x-2">
                            {donor.amount && (
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                ${donor.amount.toFixed(2)}
                              </span>
                            )}
                            {donor.itemDonated && (
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                {donor.itemDonated}
                              </span>
                            )}
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              donor.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {donor.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        {donor.message && (
                          <p className="text-sm text-gray-600 italic mt-1">
                            "{donor.message}"
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          Added {new Date(donor.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteDonor(donor.id)}
                        className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        disabled={isSubmitting}
                        aria-label={`Remove donor ${donor.name}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
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
                              <option value="INVALIDATED">Invalidated</option>
                            </select>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              donation.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                              donation.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                              donation.status === 'PENDING' ? 'bg-blue-100 text-blue-800' :
                              donation.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                              donation.status === 'INVALIDATED' ? 'bg-purple-100 text-purple-800' :
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

          {/* Inventory Management */}
          {activeTab === 'inventory' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-md font-semibold text-gray-900">Inventory Management ({inventoryItems.length})</h4>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </button>
              </div>

              {/* Add Inventory Item Form */}
              {showForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-900 mb-4">Add New Inventory Item</h5>
                  <form onSubmit={handleInventorySubmit} className="space-y-4">
                    <div className="space-y-4">
                      <h5 className="text-sm font-medium text-gray-700">Upload Images</h5>
                      
                      {imageUploadFields.map((field) => (
                        <div key={field.id} className="flex items-center space-x-2">
                          <div className="flex-1">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                handleFileChange(field.id, file);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          
                          {imageUploadFields.length > 1 && (
                            <button 
                              type="button"
                              onClick={() => removeImageUploadField(field.id)}
                              className="p-2 text-red-500 hover:text-red-700"
                              aria-label="Remove image"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={addImageUploadField}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Another Image
                      </button>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        {isSubmitting ? 'Adding...' : 'Add Item'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Inventory Items List */}
              {inventoryItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No inventory items added yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {inventoryItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium text-gray-900">
                            {item.name}
                          </h5>
                          <div className="flex items-center space-x-2">
                            {item.category && (
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                {item.category}
                              </span>
                            )}
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              item.isAvailable
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {item.isAvailable ? 'Available' : 'Sold'}
                            </span>
                          </div>
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-600 italic mt-1">
                            {item.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          Added {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteInventoryItem(item.id)}
                        className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        disabled={isSubmitting}
                        aria-label={`Remove item ${item.name}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
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
