'use client';

import { motion } from 'framer-motion';
import { DollarSign, Heart, ExternalLink } from 'lucide-react';

interface MonetaryDonationFormProps {
  isAnonymous?: boolean;
}

export default function MonetaryDonationForm({ isAnonymous = false }: MonetaryDonationFormProps) {
  const handleDonateNow = () => {
    // Open Mackenzie Health donation page in a new tab
    window.open('https://supportmackenziehealth.ca/ui/thegivingtree/donations/start', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <DollarSign className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-green-900 mb-4">Monetary Donation</h2>
        <p className="text-lg text-gray-600">
          {isAnonymous 
            ? 'Make a difference with your donation to Mackenzie Health'
            : 'Support our mission with your generous contribution'
          }
        </p>
      </div>

      {/* Simplified form - just a donate button */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Click the button below to donate directly through Mackenzie Health's secure platform.
          </p>
          <button
            onClick={handleDonateNow}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Heart className="h-5 w-5" />
            <span>Donate Now</span>
            <ExternalLink className="h-5 w-5" />
          </button>
          <p className="text-sm text-gray-500 mt-3">
            You'll be redirected to Mackenzie Health's donation page
          </p>
        </div>
      </div>

      {/* Commented out original form for potential future use */}
      {/*
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Amount
          </label>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {predefinedAmounts.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleAmountSelect(value)}
                className={`py-2 px-4 rounded-lg border transition-colors ${
                  amount === value
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-green-400 text-gray-700'
                }`}
              >
                ${value}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              placeholder="Enter custom amount"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="1"
              step="0.01"
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message (Optional)
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Share why you're donating..."
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Heart className="h-5 w-5" />
              <span>Donate ${amount || customAmount || '0'}</span>
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 mt-3 text-center">
          Click the button above to donate directly through Mackenzie Health's secure platform.
        </p>
      </form>
      */}
    </motion.div>
  );
}
