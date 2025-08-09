'use client';

import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Heart,
  Leaf,
  Send,
  MessageCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setSubmitError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage(result.message);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitError(result.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitError('Failed to send message. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50">
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-12">
            <div className="relative overflow-hidden rounded-2xl soft-shadow">
              <div className="absolute inset-0 texture-leaf" />
              <div className="relative z-10 px-6 py-12 sm:px-12">
                <div className="max-w-2xl">
                  <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900">Contact Us</h1>
                  <p className="mt-3 text-lg text-zinc-700">We’re here to help and answer any questions you may have.</p>
                </div>
              </div>
              <div className="absolute right-0 top-0 hidden h-full w-1/2 bg-[url('https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center sm:block" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information and Form */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Get In Touch</h2>
                <p className="text-lg text-gray-600 mb-8">
                  We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">
                      10 Trench Street<br />
                      Richmond Hill, ON L4C 4Z3<br />
                      Canada
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">+1 (905) 883-1212</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">Givingtreenonprofit@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Office Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 5:00 PM<br />
                      Saturday: 10:00 AM - 2:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Mission Statement */}
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="flex items-center mb-3">
                  <Heart className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Our Mission</h3>
                </div>
                <p className="text-gray-600">
                  Supporting Mackenzie Health through community donations and reselling gently used items. 
                  100% of proceeds go directly to enhancing patient care and medical equipment.
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="card p-8"
            >
              <div className="flex items-center mb-6">
                <MessageCircle className="h-6 w-6 text-green-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="Your full name"
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
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full btn btn-primary py-3 px-6">
                  <Send className="h-5 w-5 mr-2" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>

                {/* Success Message */}
                {submitMessage && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                      <div>
                        <p className="text-green-700 text-sm font-medium">Message Sent Successfully!</p>
                        <p className="text-green-600 text-sm mt-1">
                          Your message has been sent to Givingtreenonprofit@gmail.com. 
                          We&apos;ll respond within 24 hours during business days.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {submitError && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                      <div>
                        <p className="text-red-700 text-sm font-medium">Message Failed to Send</p>
                        <p className="text-red-600 text-sm mt-1">{submitError}</p>
                        <p className="text-red-600 text-sm mt-2">
                          If this problem persists, please call us directly at (905) 883-1212.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </form>

              <div className="mt-6 p-4 rounded-lg texture-leaf">
                <p className="text-sm text-zinc-700"><strong>Quick Response:</strong> For urgent matters, please call us directly at (905) 883-1212. We typically respond to emails within 24 hours during business days.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">Other Ways to Connect</h2>
            <p className="text-lg text-zinc-600">Find the best way to reach us for your specific needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-center p-6 card"
            >
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-2">Volunteer Opportunities</h3>
              <p className="text-zinc-600 mb-4">
                Interested in volunteering? Contact our volunteer coordinator for available opportunities.
              </p>
              <a 
                href="mailto:volunteers@givingtreefoundation.org" 
                className="text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                volunteers@givingtreefoundation.org
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center p-6 card"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-2">Donations & Partnerships</h3>
              <p className="text-zinc-600 mb-4">
                For large donations, corporate partnerships, or sponsorship opportunities.
              </p>
              <a 
                href="mailto:partnerships@givingtreefoundation.org" 
                className="text-blue-700 hover:text-blue-800 font-semibold"
              >
                partnerships@givingtreefoundation.org
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center p-6 card"
            >
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-2">Media & Press</h3>
              <p className="text-zinc-600 mb-4">
                Media inquiries, press releases, and interview requests.
              </p>
              <a 
                href="mailto:media@givingtreefoundation.org" 
                className="text-purple-700 hover:text-purple-800 font-semibold"
              >
                media@givingtreefoundation.org
              </a>
            </motion.div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
