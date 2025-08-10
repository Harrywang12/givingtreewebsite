'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Heart } from 'lucide-react';

interface Donor {
  id: string;
  name: string;
  totalDonated: number;
  itemsDonated: number;
  rank: number;
  memberSince: string;
}

interface LeaderboardData {
  donors: Donor[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-6 w-6 text-yellow-500" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />;
    case 3:
      return <Award className="h-6 w-6 text-amber-600" />;
    default:
      return <Heart className="h-6 w-6 text-red-400" />;
  }
};

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    case 2:
      return 'bg-gradient-to-r from-gray-300 to-gray-500';
    case 3:
      return 'bg-gradient-to-r from-amber-500 to-amber-700';
    default:
      return 'bg-white';
  }
};

export default function Leaderboard() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/leaderboard');
      if (response.ok) {
        const leaderboardData = await response.json();
        setData(leaderboardData);
      } else {
        setError('Failed to load leaderboard data');
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to load leaderboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load leaderboard'}</p>
          <button 
            onClick={fetchLeaderboard}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Donors</h2>
          <p className="text-gray-600">
            Our community's most generous supporters. Thank you for making a difference!
          </p>
        </div>

        <div className="space-y-4">
          {data.donors.map((donor, index) => (
            <motion.div
              key={donor.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center p-4 rounded-lg border ${
                donor.rank <= 3 ? 'shadow-md' : ''
              } ${getRankColor(donor.rank)}`}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mr-4">
                {getRankIcon(donor.rank)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{donor.name}</h3>
                    <p className="text-sm text-gray-600">
                      Member since {new Date(donor.memberSince).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      ${donor.totalDonated.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">Donated</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <h3 className="text-xl font-semibold text-center mb-4">Join the Leaderboard</h3>
          <p className="text-center text-gray-600 mb-4">
            Make a monetary donation today and see your name on our leaderboard!
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => window.location.href = '/donate'}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Donate Money
            </button>
            <button 
              onClick={() => window.location.href = '/donate'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Donate Items
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 