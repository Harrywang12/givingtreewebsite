'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  Leaf,
  Heart,
  Sprout,
  ArrowRight,
  Send,
  Gift,
  Code,
  Package
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';

// Nature-inspired images
const NATURAL_IMAGES = [
  "/homepagehero.jpg",
  "/naturelandscape.jpg", 
  "/personworking.jpg",
  "/homepagehero.jpg",
  "/naturelandscape.jpg",
  "/personworking.jpg"
];

export default function Home() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Home Events state
  type HomeEvent = {
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
    comments: Array<{
      id: string;
      content: string;
      createdAt: string;
      user: { id: string; name: string };
    }>;
    commentCount: number;
    likeCount: number;
    userLiked?: boolean;
    createdAt: string;
  };

  const [homeEvents, setHomeEvents] = useState<HomeEvent[]>([]);
  const [homeEventsLoading, setHomeEventsLoading] = useState<boolean>(true);
  const [homeEventsError, setHomeEventsError] = useState<string>('');

  useEffect(() => {
    const fetchHomeEvents = async () => {
      try {
        setHomeEventsLoading(true);
        const res = await fetch('/api/events?limit=6');
        if (!res.ok) throw new Error('Failed to load events');
        const data = await res.json();
        setHomeEvents(data.events || []);
      } catch (e) {
        setHomeEventsError('Failed to load updates.');
      } finally {
        setHomeEventsLoading(false);
      }
    };
    fetchHomeEvents();
  }, []);

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
  
  // Parallax scroll references
  const heroRef = useRef<HTMLElement>(null);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const handleAuthModeChange = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleScrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section - Immersive natural header */}
      <section ref={heroRef} className="relative min-h-[100svh] pt-24 sm:pt-20 flex items-center justify-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/homepagehero.jpg"
            alt="Homepage hero background"
            fill
            priority
            sizes="100vw"
            style={{objectFit: 'cover'}}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-950/70 via-green-900/60 to-green-800/50" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center mb-6 px-4 py-2 bg-green-900/30 backdrop-blur-sm rounded-full border border-green-300/20">
              <Leaf className="w-5 h-5 text-green-300 mr-2" />
              <span className="text-green-200 text-sm font-medium">Making a Difference Together</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white font-serif leading-tight mb-6 tracking-tight">
              The Giving Tree
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-green-50/90 max-w-3xl mx-auto leading-relaxed mb-8">
              Empowering communities through sustainable giving, environmental stewardship, and meaningful connections.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/donate">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  Make a donation
                </motion.button>
              </Link>
              
              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-transparent border-2 border-green-300 text-green-300 hover:bg-green-300 hover:text-green-900 font-semibold rounded-full transition-all duration-300 flex items-center gap-2"
                >
                  <ArrowRight className="w-5 h-5" />
                  Learn More
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator removed per request */}
      </section>

      {/* Mission Statement */}
      <section className="py-24 bg-green-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 opacity-5">
                  <Image
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234caf50'%3E%3Cpath d='M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C16 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z'/%3E%3C/svg%3E"
            width={256}
            height={256}
            alt=""
                  />
                </div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 opacity-5">
                  <Image
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234caf50'%3E%3Cpath d='M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C16 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z'/%3E%3C/svg%3E"
            width={256}
            height={256}
            alt=""
          />
        </div>
        
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-green-900 mb-6 font-serif">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
                    We collect and resell gently used items, with{' '}
                    <Link href="/donate" className="text-green-700 font-medium inline-flex items-center hover:text-green-500 transition-colors">
                      <Heart className="h-4 w-4 mr-1" />
                      100% of proceeds
                    </Link>{' '}
                    going directly to Mackenzie Health to enhance patient care and support community wellness initiatives.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Whether you{' '}
                    <Link href="/donate" className="text-green-700 font-medium inline-flex items-center hover:text-green-500 transition-colors">
                      <Heart className="h-4 w-4 mr-1" />
                      donate items
                    </Link>{' '}
                    or contribute financially, your generosity makes a real difference in healthcare accessibility and quality.
                  </p>
          </motion.div>
        
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card card-highlight p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center">
                <Gift className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-4">Donate Items</h3>
              <p className="text-green-700 mb-5">
                Give your gently used items a new purpose. Your donations become funding for essential hospital equipment.
              </p>
              <Link href="/donate" className="text-green-700 font-medium inline-flex items-center hover:text-green-500 transition-colors">
                Learn More
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card card-highlight p-8 text-center transform md:translate-y-4"
            >
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-4">Financial Support</h3>
              <p className="text-green-700 mb-5">
                Every dollar donated helps us expand our impact. Make a monetary gift to support our mission directly.
              </p>
              <Link href="/donate" className="text-green-700 font-medium inline-flex items-center hover:text-green-500 transition-colors">
                Contribute
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card card-highlight p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center">
                <Sprout className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-4">Volunteer</h3>
              <p className="text-green-700 mb-5">
                Join our team of dedicated volunteers. Your time and skills can make an incredible difference.
              </p>
              <Link 
                href="/volunteer"
                className="text-green-700 font-medium inline-flex items-center hover:text-green-500 transition-colors"
              >
                Join Us
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </motion.div>
            </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-24 bg-green-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-green-600 font-medium">WEEKLY SCHEDULE</span>
            <h2 className="text-4xl font-bold text-green-900 mt-2 mb-6 font-serif">Join Us Every Week</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              We have a regular schedule of activities to support our mission. Come visit us at our location 
              to donate items or find great deals while supporting Mackenzie Health.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Friday Collection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-8 text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-900 mb-4">Friday Collections</h3>
              <p className="text-gray-600 mb-6">
                Every Friday, we collect gently used items from our community.
                Bring your donations to help support Mackenzie Health.
              </p>
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <p className="text-green-800 font-semibold">📍 152 Colesbrook Rd, Richmondhill, ON L4S 2G4</p>
              </div>
              <Link
                href="/donate"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Package className="h-5 w-5 mr-2" />
                Donate Items
              </Link>
            </motion.div>

            {/* Monday Sales */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-8 text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-900 mb-4">Monday Sales</h3>
              <p className="text-gray-600 mb-6">
                Every Monday, we host sales of donated items.
                Find great deals while supporting our mission to help Mackenzie Health.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-blue-800 font-semibold">📍 152 Colesbrook Rd, Richmondhill, ON L4S 2G4</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-12"
          >
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-green-900 mb-4">Location & Hours</h3>
              <div className="grid md:grid-cols-2 gap-6 text-center">
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Friday Collections</h4>
                  <p className="text-gray-600">9:00 AM - 5:00 PM</p>
                  <p className="text-sm text-gray-500">Item donations accepted</p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Monday Sales</h4>
                  <p className="text-gray-600">10:00 AM - 6:00 PM</p>
                  <p className="text-sm text-gray-500">Public sales event</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <a 
                  href="https://maps.google.com/?q=152+Colesbrook+Rd,+Richmondhill,+ON+L4S+2G4" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Get Directions on Google Maps
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Section with Parallax Image */}
      <section className="relative py-24">
        <div className="absolute inset-0 z-0">
          <Image 
            src={NATURAL_IMAGES[1]}
            alt="Community volunteers working together"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/80"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            >
              <span className="text-green-600 font-medium">OUR IMPACT</span>
              <h2 className="text-4xl font-bold text-green-900 mt-2 mb-6 font-serif">Making a Real Difference</h2>
              
              <div className="space-y-6 text-green-800">
                <p className="lead-text">
                  Since our foundation in September 2025, we've been transforming community generosity 
                  into tangible improvements for healthcare. Every donation creates a ripple effect of positive change.
                </p>
                
                {/* Stats removed per request */}
                
                <Link href="/about" className="btn btn-primary inline-flex">
                  Learn More About Our Work
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </div>
          </motion.div>

          <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 rounded-2xl overflow-hidden img-natural">
                <Image 
                  src={NATURAL_IMAGES[2]}
                  alt="Healthcare professionals using equipment funded by donations"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              
                              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-green-100 rounded-full z-0"></div>
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-green-50 rounded-full z-0"></div>
          </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-green-50/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-green-600 font-medium">OUR TEAM</span>
            <h2 className="text-4xl font-bold text-green-900 mt-2 mb-6 font-serif">Meet the Founders</h2>
            <p className="lead-text text-green-800 max-w-3xl mx-auto">
              Passionate individuals dedicated to making healthcare better for everyone through 
              community action and sustainable giving.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card p-8 text-center relative overflow-hidden group"
            >
              <div className="relative z-10">
                <div className="w-32 h-32 bg-green-200 rounded-full mx-auto mb-6 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="h-16 w-16 text-green-700" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-2 font-serif">Ruogu Qiu</h3>
                <p className="text-green-600 font-medium mb-4">Co-Founder</p>
                <p className="text-green-700 mb-5">
                  Combining a passion for healthcare improvement with community organizing 
                  to create sustainable impact for patients and families.
                </p>
              </div>
              
              {/* Subtle background decoration */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-100 rounded-full opacity-50 z-0 transition-transform duration-500 group-hover:scale-125"></div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card p-8 text-center relative overflow-hidden group"
            >
              <div className="relative z-10">
                <div className="w-32 h-32 bg-blue-200 rounded-full mx-auto mb-6 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="h-16 w-16 text-blue-700" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-2 font-serif">Justin Wu</h3>
                <p className="text-green-600 font-medium mb-4">Co-Founder</p>
                <p className="text-green-700 mb-5">
                  Driven by a vision of creating stronger healthcare systems through 
                  innovative community partnerships and resource sharing.
                </p>
              </div>
              
              {/* Subtle background decoration */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-100 rounded-full opacity-50 z-0 transition-transform duration-500 group-hover:scale-125"></div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card p-8 text-center relative overflow-hidden group"
            >
              <div className="relative z-10">
                <div className="w-32 h-32 bg-purple-200 rounded-full mx-auto mb-6 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <Code className="h-16 w-16 text-purple-700" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-2 font-serif">Harrison Wang</h3>
                <p className="text-green-600 font-medium mb-4">CTO</p>
                <p className="text-green-700 mb-5">
                  Leading the technical vision and digital infrastructure to create seamless 
                  experiences that connect donors, volunteers, and healthcare communities.
                </p>
            </div>
              
              {/* Subtle background decoration */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-100 rounded-full opacity-50 z-0 transition-transform duration-500 group-hover:scale-125"></div>
          </motion.div>
          </div>

          <div className="text-center mt-12">
            <Link href="/team" className="inline-flex items-center text-green-700 font-medium hover:text-green-600 transition-colors">
              Meet Our Full Team
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 h-64 w-64 bg-green-50 rounded-full -mt-20 -mr-20"></div>
        <div className="absolute bottom-0 left-0 h-40 w-40 bg-green-50 rounded-full -mb-20 -ml-20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-green-600 font-medium">STAY UPDATED</span>
            <h2 className="text-4xl font-bold text-green-900 mt-2 mb-6 font-serif">Latest News & Events</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homeEventsLoading && (
              <div className="col-span-full text-center text-zinc-600">Loading updates...</div>
            )}
            {homeEventsError && !homeEventsLoading && (
              <div className="col-span-full text-center text-red-600">{homeEventsError}</div>
            )}
            {!homeEventsLoading && !homeEventsError && homeEvents.length === 0 && (
              <div className="col-span-full text-center text-zinc-600">No events scheduled at the moment.</div>
            )}
            {!homeEventsLoading && !homeEventsError && homeEvents.slice(0, 3).map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="card p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                  <span className="text-xs text-gray-500">{formatDate(event.date)}</span>
                </div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{event.location}</span>
                </div>
                <Link
                  href={`/events/${event.id}`}
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  Learn More
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/events" className="inline-flex items-center justify-center rounded-xl border border-emerald-200 px-8 py-3 font-semibold text-emerald-700 hover:bg-emerald-50">
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Volunteer Section */}
      <section className="py-24 bg-green-50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-green-600 font-medium">GET INVOLVED</span>
            <h2 className="text-4xl font-bold text-green-900 mt-2 mb-6 font-serif">Volunteer With Us</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
              Join our dedicated team of volunteers and make a direct impact in your community. 
              Help us collect, organize, and distribute donations to support Mackenzie Health.
            </p>
            <Link
              href="/volunteer"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Users className="h-5 w-5 mr-2" />
              Become a Volunteer
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-green-600 font-medium">MAKE A DIFFERENCE</span>
            <h2 className="text-4xl font-bold text-green-900 mt-2 mb-6 font-serif">Support Our Mission</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
              Every donation, whether monetary or in-kind, directly supports Mackenzie Health. 
              Your generosity helps us provide better healthcare for our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/donate"
                className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <Heart className="h-5 w-5 mr-2" />
                Donate Now
              </Link>
              <Link
                href="/donate"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg border-2 border-green-600 hover:bg-green-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <Package className="h-5 w-5 mr-2" />
                Donate Items
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Partners Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-green-600 font-medium">OUR PARTNERS</span>
            <h2 className="text-4xl font-bold text-green-900 mt-2 mb-10 font-serif">Committed to Community Health</h2>
            <div className="flex justify-center items-center">
              <Image
                src="/mackenziehealth.jpg"
                alt="Mackenzie Health Logo"
                width={300}
                height={150}
                className="object-contain"
              />
            </div>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mt-8">
              We are proud to partner with Mackenzie Health, dedicating 100% of our proceeds to support their vital work in enhancing patient care and community well-being.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section - MOVED TO BOTTOM */}
      <section id="contact" className="py-24 bg-green-50 relative overflow-hidden">
        {/* Decorative leaf pattern */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23047857' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
             }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-green-600 font-medium">GET IN TOUCH</span>
            <h2 className="text-4xl font-bold text-green-900 mt-2 mb-6 font-serif">Contact Us</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Have questions about our mission, want to volunteer, or need information about donations? 
              We'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-green-900 mb-6">Let's Connect</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">152 Colesbrook Rd, Richmondhill, ON L4S 2G4</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">(647) 897-9128</p>
                    <p className="text-gray-600">(437) 214-6840</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">givingtreenonprofit@gmail.com</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-green-900 mb-6">Send us a Message</h3>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your full name"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="What's this about?"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Tell us more..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Send className="h-5 w-5" />
                    <span>Send Message</span>
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </div>
  );
}