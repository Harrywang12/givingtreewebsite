'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Check, 
  X, 
  AlertCircle, 
  Clock, 
  DollarSign, 
  ChevronDown, 
  ChevronUp,
  RefreshCw,
  Ban
} from 'lucide-react';

interface Donation {
  id: string;
  userId: string;
  amount: number;
  status: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  user?: {
    name: string;
    email: string;
  };
}

export default function AdminDonationManager() {
  const { token } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [statusUpdateData, setStatusUpdateData] = useState({
    status: '',
    reason: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, [token, sortField, sortDirection]);

  const fetchDonations = async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/admin/donations?sort=${sortField}&direction=${sortDirection}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDonations(data.donations || []);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load donations');
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      setError('Failed to load donations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-600';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-600';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-600';
      case 'FAILED':
        return 'bg-red-100 text-red-600';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-600';
      case 'INVALIDATED':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Check className="h-4 w-4" />;
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'PROCESSING':
        return <RefreshCw className="h-4 w-4" />;
      case 'FAILED':
        return <X className="h-4 w-4" />;
      case 'CANCELLED':
        return <X className="h-4 w-4" />;
      case 'INVALIDATED':
        return <Ban className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleSelectDonation = (donation: Donation) => {
    setSelectedDonation(donation);
    setStatusUpdateData({
      status: donation.status,
      reason: ''
    });
    setUpdateSuccess(false);
  };

  const handleUpdateStatus = async () => {
    if (!selectedDonation || !statusUpdateData.status || !token) return;
    
    setIsUpdating(true);
    setError('');
    setUpdateSuccess(false);
    
    try {
      const response = await fetch(`/api/admin/donations/${selectedDonation.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: statusUpdateData.status,
          reason: statusUpdateData.reason
        })
      });
      
      if (response.ok) {
        setUpdateSuccess(true);
        // Refresh the donations list
        fetchDonations();
        // Update the selected donation
        const data = await response.json();
        if (data.donation) {
          setSelectedDonation({
            ...selectedDonation,
            status: data.donation.status,
            updatedAt: data.donation.updatedAt
          });
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update donation status');
      }
    } catch (error) {
      console.error('Error updating donation status:', error);
      setError('Failed to update donation status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Donation Management</h2>
        <button
          onClick={fetchDonations}
          className="flex items-center text-green-600 hover:text-green-700"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center">
                    Date
                    {sortField === 'createdAt' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center">
                    Amount
                    {sortField === 'amount' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {sortField === 'status' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(donation.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium text-gray-900">${donation.amount.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donation.user ? donation.user.name : 'Anonymous'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(donation.status)}`}>
                      <span className="flex items-center">
                        {getStatusIcon(donation.status)}
                        <span className="ml-1">{donation.status.toLowerCase()}</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleSelectDonation(donation)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
              {donations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No donations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedDonation && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Donation Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Donation ID</h4>
              <p className="text-gray-900">{selectedDonation.id}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Amount</h4>
              <p className="text-gray-900">${selectedDonation.amount.toFixed(2)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Created At</h4>
              <p className="text-gray-900">{formatDate(selectedDonation.createdAt)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Confirmed At</h4>
              <p className="text-gray-900">{selectedDonation.confirmedAt ? formatDate(selectedDonation.confirmedAt) : 'Not confirmed'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">User</h4>
              <p className="text-gray-900">{selectedDonation.user ? `${selectedDonation.user.name} (${selectedDonation.user.email})` : 'Anonymous'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Current Status</h4>
              <p className="text-gray-900">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedDonation.status)}`}>
                  {selectedDonation.status.toLowerCase()}
                </span>
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Update Status</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                <select
                  value={statusUpdateData.status}
                  onChange={(e) => setStatusUpdateData({...statusUpdateData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="FAILED">Failed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="INVALIDATED">Invalidated</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Change</label>
                <input
                  type="text"
                  value={statusUpdateData.reason}
                  onChange={(e) => setStatusUpdateData({...statusUpdateData, reason: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Optional reason for status change"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleUpdateStatus}
                disabled={isUpdating || statusUpdateData.status === selectedDonation.status}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  'Update Status'
                )}
              </button>
            </div>
            
            {updateSuccess && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm flex items-start">
                <Check className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>Donation status updated successfully.</span>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
