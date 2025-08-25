'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MessageCircle, ThumbsUp, Heart, Users, User, ImageIcon } from 'lucide-react';
import PageBanner from '@/components/PageBanner';
import EventImage from '@/components/EventImage';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

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

export default function AnnouncementsPage() {
  const { user, token } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [likingEvents, setLikingEvents] = useState<Set<string>>(new Set());

  // Fetch announcements (NEWS and ANNOUNCEMENT types only) from API
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      // Fetch both NEWS and ANNOUNCEMENT types, excluding EVENT type
      const response = await fetch('/api/events?limit=20');
      
      if (response.ok) {
        const data = await response.json();
        // Filter to only show NEWS and ANNOUNCEMENT types
        const announcements = (data.events || []).filter((event: Event) => 
          event.type === 'NEWS' || event.type === 'ANNOUNCEMENT'
        );
        setEvents(announcements);
      } else {
        setError('Failed to load announcements');
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setError('Failed to load announcements');
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

  const handleDeleteComment = async (eventId: string, commentId: string) => {
    if (!user || !token) return;

    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`/api/events/${eventId}/comments`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ commentId })
      });

      if (response.ok) {
        // Remove the deleted comment from the local state
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { 
                ...event, 
                comments: event.comments.filter(comment => comment.id !== commentId),
                commentCount: event.commentCount - 1
              }
            : event
        ));
      } else {
        const error = await response.json();
        setError(error.error || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Failed to delete comment');
    }
  };

  const formatDate = (dateString: string) => {
    // Add timezone offset to prevent date shifting
    const date = new Date(dateString + 'T12:00:00');
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
        return 'bg-gray-100 text-gray-700 dark:text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-800">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50">
      <PageBanner
        title="News & Announcements"
        subtitle="Stay updated with the latest news and announcements from The Giving Tree Foundation"
      />

      {/* Announcements List */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-zinc-900 mb-8">Latest Updates</h2>
            <p className="text-xl text-green-800">
              Follow our journey and stay connected with our community
            </p>
          </motion.div>

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchAnnouncements}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {events.length === 0 && !error ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-700 dark:text-gray-900 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">No Announcements Yet</h3>
              <p className="text-green-800 mb-6">
                Our admins haven't posted any announcements yet. Check back soon!
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
                  className="card p-8 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-700 dark:text-gray-800 mr-2" />
                      <span className="text-green-800">{formatDate(event.date)}</span>
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
                      <span className="text-sm text-green-700">
                        By {event.author.name}
                      </span>
                      <button 
                        onClick={() => handleLike(event.id)}
                        disabled={!user || likingEvents.has(event.id)}
                        className={`flex items-center space-x-1 transition-colors ${
                          user 
                            ? 'text-zinc-700 dark:text-zinc-800 hover:text-red-500 cursor-pointer' 
                            : 'text-zinc-700 dark:text-zinc-800 cursor-not-allowed'
                        } ${event.userLiked ? 'text-red-500' : ''}`}
                      >
                        <ThumbsUp className={`h-4 w-4 ${likingEvents.has(event.id) ? 'animate-pulse' : ''}`} />
                        <span>{event.likeCount}</span>
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
                  <p className="text-green-800 mb-4">{event.description}</p>
                  
                  {/* Event Image */}
                  {(() => {
                    console.log('Event image debug:', {
                      title: event.title,
                      hasImageUrl: !!event.imageUrl,
                      imageUrl: event.imageUrl,
                      imageUrlLength: event.imageUrl?.length
                    });
                    
                    return event.imageUrl ? (
                      <div className="mb-4">
                        <EventImage 
                          src={event.imageUrl} 
                          alt={event.title}
                          className="w-full h-48 md:h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        />
                      </div>
                    ) : (
                      <div className="mb-4">
                        <div className="w-full h-48 md:h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">No image uploaded</p>
                            <p className="text-xs text-gray-500 mt-1">Event: {event.title}</p>
                            <p className="text-xs text-red-500 mt-1">Debug: imageUrl is null/undefined</p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  
                  {event.content && (
                    <div className="bg-white p-4 rounded-lg mb-4">
                      <p className="text-zinc-700 whitespace-pre-wrap">{event.content}</p>
                    </div>
                  )}

                  {event.location && (
                                          <p className="text-sm text-green-700 mb-4">
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
                          className="field"
                          disabled={commentingOn === event.id}
                        />
                        <button 
                          type="submit"
                          disabled={commentingOn === event.id || !newComment[event.id]?.trim()}
                          className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {commentingOn === event.id ? 'Posting...' : 'Post'}
                        </button>
                      </form>
                    ) : (
                      <div className="bg-gray-100 p-3 rounded-lg mb-4 text-center">
                        <p className="text-green-800">
                          <a href="/dashboard" className="text-emerald-700 hover:underline">Sign in</a> to join the conversation
                        </p>
                      </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-3">
                      {event.comments.slice(0, 5).map((comment) => (
                        <div key={comment.id} className="bg-white p-3 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-zinc-800 dark:text-zinc-900 mr-2" />
                              <span className="text-sm font-medium text-zinc-700">{comment.user.name}</span>
                              <span className="text-xs text-green-700 ml-2">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {/* Delete button - only show for comment owner or admin */}
                            {(user?.id === comment.user.id || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                              <button
                                onClick={() => handleDeleteComment(event.id, comment.id)}
                                className="text-red-600 hover:text-red-800 text-xs hover:underline"
                                title="Delete comment"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                          <p className="text-sm text-green-800">{comment.content}</p>
                        </div>
                      ))}
                      
                      {event.commentCount > 5 && (
                        <div className="text-center">
                          <button className="text-emerald-700 hover:underline text-sm">
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-zinc-900 mb-8">Get Involved</h2>
            <p className="text-xl text-green-800">
              Join our community and make a difference
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="card p-6 text-center"
            >
              <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">Make a Donation</h3>
              <p className="text-green-800 mb-4">Support our mission with a financial contribution</p>
              <button 
                onClick={() => window.location.href = '/donate'}
                className="btn btn-primary"
              >
                Donate Now
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="card p-6 text-center"
            >
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">Volunteer</h3>
              <p className="text-green-800 mb-4">Join our team and help us grow our impact</p>
              <Link
                href="/volunteer"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-8 py-3 font-semibold text-white hover:bg-emerald-700"
              >
                <Users className="h-5 w-5 mr-2" />
                Volunteer Now
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 text-zinc-900">Stay Connected</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-green-800">
              Follow our journey and be part of our mission to support Mackenzie Health
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => (window.location.href = '/donate')} className="btn btn-primary px-8 py-3">
                Make a Donation
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}