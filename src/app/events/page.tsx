'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MessageCircle, ThumbsUp, Heart, Users, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

interface Event {
  id: string;
  title: string;
  description: string;
  content?: string;
  date: string;
  type: 'NEWS' | 'EVENT' | 'ANNOUNCEMENT';
  location?: string;
  imageUrl?: string;
  author: {
    name: string;
    isAdmin: boolean;
  };
  comments: Comment[];
  commentCount: number;
  likeCount: number;
  userLiked?: boolean;
  createdAt: string;
}

export default function EventsPage() {
  const { user, token } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [likingEvents, setLikingEvents] = useState<Set<string>>(new Set());

  // Fetch events from API
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events?limit=20');
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      } else {
        setError('Failed to load events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (eventId: string) => {
    if (!user || !token || likingEvents.has(eventId)) return;

    setLikingEvents(prev => new Set(prev).add(eventId));

    try {
      const response = await fetch(`/api/events/${eventId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update the event in state
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { 
                ...event, 
                likeCount: result.likeCount,
                userLiked: result.liked
              }
            : event
        ));
      } else {
        console.error('Failed to like event');
      }
    } catch (error) {
      console.error('Error liking event:', error);
    } finally {
      setLikingEvents(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    }
  };

  const handleComment = async (eventId: string) => {
    if (!user || !token || !newComment[eventId]?.trim()) return;

    setCommentingOn(eventId);

    try {
      const response = await fetch(`/api/events/${eventId}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: newComment[eventId].trim()
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Add the new comment to the event
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { 
                ...event, 
                comments: [result.comment, ...event.comments],
                commentCount: event.commentCount + 1
              }
            : event
        ));
        
        // Clear the comment input
        setNewComment(prev => ({ ...prev, [eventId]: '' }));
      } else {
        const errorData = await response.json();
        console.error('Failed to post comment:', errorData.error);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setCommentingOn(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'NEWS':
        return 'bg-blue-100 text-blue-600';
      case 'EVENT':
        return 'bg-green-100 text-green-600';
      case 'ANNOUNCEMENT':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

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

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchEvents}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {events.length === 0 && !error ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Yet</h3>
              <p className="text-gray-600 mb-6">
                Our admins haven't posted any events yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-lg p-8 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-gray-600">{formatDate(event.date)}</span>
                      <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                      {event.author.isAdmin && (
                        <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                          Official
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        By {event.author.name}
                      </span>
                      <button 
                        onClick={() => handleLike(event.id)}
                        disabled={!user || likingEvents.has(event.id)}
                        className={`flex items-center space-x-1 transition-colors ${
                          user 
                            ? 'text-gray-600 hover:text-red-500 cursor-pointer' 
                            : 'text-gray-400 cursor-not-allowed'
                        } ${event.userLiked ? 'text-red-500' : ''}`}
                      >
                        <ThumbsUp className={`h-4 w-4 ${likingEvents.has(event.id) ? 'animate-pulse' : ''}`} />
                        <span>{event.likeCount}</span>
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  
                  {event.content && (
                    <div className="bg-white p-4 rounded-lg mb-4">
                      <p className="text-gray-700 whitespace-pre-wrap">{event.content}</p>
                    </div>
                  )}

                  {event.location && (
                    <p className="text-sm text-gray-500 mb-4">
                      📍 {event.location}
                    </p>
                  )}
                  
                  {/* Comments Section */}
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3 flex items-center">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Comments ({event.commentCount})
                    </h4>
                    
                    {/* Add Comment Form */}
                    {user ? (
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleComment(event.id);
                        }} 
                        className="flex gap-2 mb-4"
                      >
                        <input
                          type="text"
                          value={newComment[event.id] || ''}
                          onChange={(e) => setNewComment(prev => ({
                            ...prev,
                            [event.id]: e.target.value
                          }))}
                          placeholder="Add a comment..."
                          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          disabled={commentingOn === event.id}
                        />
                        <button 
                          type="submit"
                          disabled={commentingOn === event.id || !newComment[event.id]?.trim()}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {commentingOn === event.id ? 'Posting...' : 'Post'}
                        </button>
                      </form>
                    ) : (
                      <div className="bg-gray-100 p-3 rounded-lg mb-4 text-center">
                        <p className="text-gray-600">
                          <a href="/dashboard" className="text-green-600 hover:underline">Sign in</a> to join the conversation
                        </p>
                      </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-3">
                      {event.comments.slice(0, 5).map((comment) => (
                        <div key={comment.id} className="bg-white p-3 rounded-lg border">
                          <div className="flex items-center mb-2">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-700">{comment.user.name}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{comment.content}</p>
                        </div>
                      ))}
                      
                      {event.commentCount > 5 && (
                        <div className="text-center">
                          <button className="text-green-600 hover:underline text-sm">
                            View all {event.commentCount} comments
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Get Involved Section */}
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