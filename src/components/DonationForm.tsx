'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Upload, X, CheckCircle } from 'lucide-react';

interface DonationFormData {
  name: string;
  email: string;
  phone: string;
  itemDescription: string;
  itemCondition: string;
  estimatedValue: string;
  pickupPreference: string;
  additionalNotes: string;
}

interface DonationFormProps {
  isAnonymous?: boolean;
}

export default function DonationForm({ isAnonymous = false }: DonationFormProps) {
  const [formData, setFormData] = useState<DonationFormData>({
    name: '',
    email: '',
    phone: '',
    itemDescription: '',
    itemCondition: '',
    estimatedValue: '',
    pickupPreference: '',
    additionalNotes: ''
  });
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Convert images to base64 for email attachments
      const imageAttachments = await Promise.all(
        images.map(async (file) => {
          return new Promise<{ filename: string; content: string; contentType: string }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const base64Content = (reader.result as string).split(',')[1]; // Remove data URL prefix
              resolve({
                filename: file.name,
                content: base64Content,
                contentType: file.type
              });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );

      // Prepare the email data
      const emailData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        items: [{
          name: formData.itemDescription,
          category: 'General',
          condition: formData.itemCondition,
          description: formData.itemDescription,
          quantity: 1
        }],
        pickupPreference: formData.pickupPreference,
        preferredDate: '',
        notes: `${formData.additionalNotes}\n\nEstimated Value: ${formData.estimatedValue || 'Not specified'}\n\nImages attached: ${imageAttachments.length} file(s)${isAnonymous ? '\n\nAnonymous Donation' : ''}`,
        attachments: imageAttachments
      };

      const response = await fetch('/api/donations/items/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: '',
            email: '',
            phone: '',
            itemDescription: '',
            itemCondition: '',
            estimatedValue: '',
            pickupPreference: '',
            additionalNotes: ''
          });
          setImages([]);
        }, 3000);
      } else {
        setSubmitError(result.error || 'Failed to submit donation. Please try again.');
      }
    } catch (error) {
      console.error('Donation form error:', error);
      setSubmitError('Failed to submit donation. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto p-8 bg-green-50 rounded-lg text-center"
      >
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800 mb-2">Donation Request Submitted!</h3>
        <div className="text-green-700 space-y-2">
          <p className="font-medium">
            ✅ Your donation request has been successfully sent to Givingtreenonprofit@gmail.com
          </p>
          <p>
            📧 We&apos;ll review your items and contact you within 24-48 hours to arrange pickup or drop-off.
          </p>
          <p>
            📞 For urgent donations, call us at (905) 883-1212
          </p>
        </div>
      </motion.div>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Donate Items</h2>
          <p className="text-gray-600">
            Help us support Mackenzie Health by donating gently used items. 
            Please fill out the form below and include photos of your items.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Item Information */}
          <div>
            <label htmlFor="itemDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Item Description *
            </label>
            <textarea
              id="itemDescription"
              name="itemDescription"
              value={formData.itemDescription}
              onChange={handleInputChange}
              required
              rows={4}
              placeholder="Please describe the items you're donating (e.g., furniture, electronics, clothing, etc.)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="itemCondition" className="block text-sm font-medium text-gray-700 mb-2">
                Item Condition *
              </label>
              <select
                id="itemCondition"
                name="itemCondition"
                value={formData.itemCondition}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select condition</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
            <div>
              <label htmlFor="estimatedValue" className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Value
              </label>
              <input
                type="text"
                id="estimatedValue"
                name="estimatedValue"
                value={formData.estimatedValue}
                onChange={handleInputChange}
                placeholder="e.g., $50-100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="pickupPreference" className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Preference
              </label>
              <select
                id="pickupPreference"
                name="pickupPreference"
                value={formData.pickupPreference}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select preference</option>
                <option value="pickup">Pickup needed</option>
                <option value="dropoff">I can drop off</option>
                <option value="either">Either option works</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Photos
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Upload photos of your items (up to 5 images)
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
              >
                Choose Files
              </label>
            </div>
            
            {/* Display uploaded images */}
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={URL.createObjectURL(image)}
                      alt={`Item ${index + 1}`}
                      width={96}
                      height={96}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Any additional information about your donation..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {images.length > 0 ? 'Processing images...' : 'Submitting...'}
                </>
              ) : (
                'Submit Donation'
              )}
            </button>

            {/* Error Message */}
            {submitError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <X className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-red-700 text-sm font-medium">Donation Request Failed</p>
                    <p className="text-red-600 text-sm mt-1">{submitError}</p>
                    <p className="text-red-600 text-sm mt-2">
                      Please try again or call us directly at (905) 883-1212.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
} 