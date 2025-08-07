'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MessageCircle, ThumbsUp, Heart, Users } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
  likes: number;
  comments: string[];
  type: 'news' | 'event';
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Foundation Launch",
      date: "December 2025",
      description: "We're excited to announce the official launch of The Giving Tree Non-Profit Foundation! Join us in our mission to support Mackenzie Health and make a difference in our community.",
      likes: 45,
      comments: [
        "Congratulations on the launch! Looking forward to supporting this great cause.",
        "This is exactly what our community needs. Count me in!",
        "Amazing initiative! Can't wait to see the impact you'll make."
      ],
      type: 'news'
    },
    {
      id: 2,
      title: "First Community Donation Drive",
      date: "January 2026",
      description: "Join us for our first community-wide donation drive. We'll be collecting gently used items at multiple locations across the city. Every item donated helps support Mackenzie Health.",
      likes: 32,
      comments: [
        "I have some furniture to donate. Where can I drop it off?",
        "Great idea! I'll spread the word to my neighbors.",
        "This is such a sustainable way to support healthcare."
      ],
      type: 'event'
    },
    {
      id: 3,
      title: "Volunteer Orientation Session",
      date: "February 2026",
      description: "Interested in volunteering with The Giving Tree Foundation? Join us for an orientation session to learn about our mission, processes, and how you can get involved.",
      likes: 28,
      comments: [
        "I'd love to volunteer! How do I sign up?",
        "Perfect timing! I've been looking for ways to give back.",
        "What kind of volunteer opportunities are available?"
      ],
      type: 'event'
    }
  ]);

  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});

  const handleLike = (eventId: number) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, likes: event.likes + 1 } : event
    ));
  };

  const handleComment = (eventId: number) => {
    const comment = newComment[eventId];
    if (comment && comment.trim()) {
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, comments: [...event.comments, comment] }
          : event
      ));
      setNewComment(prev => ({ ...prev, [eventId]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-green-100 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">News & Events</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Stay updated with the latest news and upcoming events from The Giving Tree Foundation
            </p>
          </motion.div>
        </div>
      </div>

      {/* Events List */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Latest Updates</h2>
            <p className="text-xl text-gray-600">
              Follow our journey and stay connected with our community
            </p>
          </motion.div>

          <div className="space-y-8">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-lg p-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-600">{event.date}</span>
                    <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                      event.type === 'news' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {event.type === 'news' ? 'News' : 'Event'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleLike(event.id)}
                      className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{event.likes}</span>
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
                <p className="text-gray-600 mb-6">{event.description}</p>
                
                {/* Comments Section */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Comments ({event.comments.length})
                  </h4>
                  <div className="space-y-2 mb-4">
                    {event.comments.map((comment, commentIndex) => (
                      <div key={commentIndex} className="bg-white p-3 rounded border">
                        <p className="text-sm text-gray-600">{comment}</p>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleComment(event.id);
                  }} className="flex gap-2">
                    <input
                      type="text"
                      value={newComment[event.id] || ''}
                      onChange={(e) => setNewComment(prev => ({
                        ...prev,
                        [event.id]: e.target.value
                      }))}
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button 
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Post
                    </button>
                  </form>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Get Involved</h2>
            <p className="text-xl text-gray-600">
              Join our community and make a difference
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Make a Donation</h3>
              <p className="text-gray-600 mb-4">Support our mission with a financial contribution</p>
              <button 
                onClick={() => window.location.href = '/donate'}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Donate Now
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Volunteer</h3>
              <p className="text-gray-600 mb-4">Join our team and help us grow our impact</p>
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Get Involved
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Stay Updated</h3>
              <p className="text-gray-600 mb-4">Subscribe to our newsletter for the latest updates</p>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
              >
                Subscribe
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Stay Connected</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Follow our journey and be part of our mission to support Mackenzie Health
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/donate'}
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Make a Donation
              </button>
              <button 
                onClick={() => window.location.href = '/leaderboard'}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
              >
                View Leaderboard
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 