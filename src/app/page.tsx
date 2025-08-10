'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  ThumbsUp,
  Leaf,
  Heart,
  Sprout,
  ArrowRight,
  Send,
  Gift,
  Code
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';

// Nature-inspired images
const NATURAL_IMAGES = [
  "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1598499255830-115fd9d6d006?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000&auto=format&fit=crop"
];

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');
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
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement email subscription
    alert('Thank you for subscribing!');
    setEmail('');
  };

  const handleLike = () => {
    setLikes(prev => prev + 1);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments(prev => [...prev, newComment]);
      setNewComment('');
    }
  };

  const handleDashboardClick = () => {
    if (user) {
      // User is logged in, go directly to dashboard
      router.push('/dashboard');
    } else {
      // User is not logged in, show login modal
      setAuthMode('login');
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section - Immersive natural header */}
      <section ref={heroRef} className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        {/* Full-bleed background image with overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src={NATURAL_IMAGES[0]}
            alt="Lush green forest with sunlight streaming through the leaves" 
            fill
            priority
            quality={90}
            className="object-cover brightness-[0.85]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-950/30 via-green-900/20 to-green-950/60"></div>
        </div>

        {/* Animated floating leaves */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Use useMemo to generate deterministic values to avoid hydration mismatch */}
          {useMemo(() => {
            // Generate deterministic values based on index to avoid hydration mismatch
            const leaves = Array.from({ length: 10 }, (_, i) => {
              // Use a simple hash function to generate consistent "random" values
              const hash = (i * 9301 + 49297) % 233280;
              const normalized = hash / 233280;
              
              return {
                startX: (normalized * 100 - 50) * 0.8,
                endX: ((normalized * 0.7 + 0.3) * 100 - 50) * 0.8,
                startY: -50 - (normalized * 50),
                duration: 15 + (normalized * 10),
                left: `${normalized * 100}%`,
                opacity: 0.3 + (normalized * 0.4),
                size: 10 + (normalized * 20),
              };
            });
            
            return leaves.map((leaf, i) => (
              <motion.div 
                key={i}
                className="absolute"
                animate={{
                  x: [leaf.startX, leaf.endX],
                  y: [leaf.startY, 1000], // Fixed height
                  rotate: [0, 360]
                }}
                transition={{
                  duration: leaf.duration,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  left: leaf.left,
                  top: `-50px`,
                  opacity: leaf.opacity,
                }}
              >
                <Leaf width={leaf.size} height={leaf.size} className="text-green-200" />
              </motion.div>
            ));
          }, []) /* Empty dependency array means this only runs once */}
        </div>

        {/* Hero content */}
        <motion.div 
          style={{
            opacity: heroOpacity,
            scale: heroScale,
            y: heroY
          }}
          className="container relative z-10 px-4 mx-auto text-center text-white"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center justify-center mb-6">
              <span className="inline-block h-1 w-10 bg-green-300 mr-3"></span>
              <span className="font-serif text-green-200 tracking-wider text-lg">THE GIVING TREE FOUNDATION</span>
              <span className="inline-block h-1 w-10 bg-green-300 ml-3"></span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 font-serif">
              Growing a Better Future
              <span className="block mt-2 text-green-300">Together</span>
            </h1>
            
            <p className="lead-text mb-10 max-w-2xl mx-auto text-gray-100">
              We transform community generosity into vital support for healthcare. 
              Every donation helps nurture better care and healthier lives at Mackenzie Health.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/donate" className="btn btn-primary group text-lg">
                <Heart className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Donate Now
              </Link>
              <Link href="/leaderboard" className="btn btn-secondary text-lg">
                View Impact
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </motion.div>

          {/* Scroll indicator removed per request */}
        </motion.div>
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
            <p className="text-xl text-green-800 leading-relaxed">
              The Giving Tree Foundation transforms generosity into tangible support for healthcare. 
              We collect and resell gently used items, directing 100% of proceeds to Mackenzie Health, 
              fostering a community of giving that improves care for all.
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
              <div className="col-span-full text-center text-zinc-600">No updates yet. Check back soon.</div>
            )}
            {homeEvents.slice(0, 6).map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="card overflow-hidden group"
              >
                <div className="h-48 overflow-hidden">
                  <Image
                    src={event.imageUrl || NATURAL_IMAGES[(3 + idx) % NATURAL_IMAGES.length]}
                    alt={event.title}
                    width={500}
                    height={300}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center text-green-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">{formatDate(event.date)}</span>
                      <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-green-900 mb-3">{event.title}</h3>
                  <p className="text-green-700 mb-4 line-clamp-3">{event.description}</p>
                  <Link href="/events" className="text-green-700 font-medium inline-flex items-center hover:text-green-500 transition-colors">
                    Read More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
              </div>

          <div className="text-center mt-12">
            <Link href="/events" className="btn btn-secondary">
              View All Updates
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-green-50 relative overflow-hidden">
        {/* Decorative leaf pattern */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='96' viewBox='0 0 60 96'%3E%3Cg fill='%234caf50' fill-opacity='0.3'%3E%3Cpath d='M36 10a6 6 0 0 1 12 0v12a6 6 0 0 1-12 0V10zm24 78a6 6 0 0 1-6 6h-12a6 6 0 0 1 0-12h12a6 6 0 0 1 6 6zM4 72a6 6 0 0 1-4-10l8-8a6 6 0 0 1 8 8l-8 8a5.9 5.9 0 0 1-4 2zm54-8a6 6 0 0 1 0-12h12a6 6 0 0 1 0 12H58zm-48 0a6 6 0 0 1 0-12H22a6 6 0 0 1 0 12H10zM32 58a6 6 0 0 1-12 0V46a6 6 0 0 1 12 0v12zm24-42a6 6 0 0 1-6 6H38a6 6 0 0 1 0-12h12a6 6 0 0 1 6 6zm-48 0a6 6 0 0 1-6 6H0a6 6 0 0 1 0-12h2a6 6 0 0 1 6 6z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 96px'
          }}>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            >
              <span className="text-green-600 font-medium">GET IN TOUCH</span>
              <h2 className="text-4xl font-bold text-green-900 mt-2 mb-6 font-serif">Contact Us</h2>
              
              <div className="space-y-6 text-green-800">
                <p className="lead-text">
                  Have questions or want to get involved? We'd love to hear from you. 
                  Reach out through any of these channels or fill out our contact form.
                </p>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mt-1">
                      <Mail className="h-5 w-5 text-green-700" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-green-900">Email</h4>
                      <p className="text-green-700">Givingtreenonprofit@gmail.com</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mt-1">
                      <Phone className="h-5 w-5 text-green-700" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-green-900">Phone</h4>
                      <p className="text-green-700">(905) 883-1212</p>
                </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mt-1">
                      <MapPin className="h-5 w-5 text-green-700" />
                </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-green-900">Location</h4>
                      <p className="text-green-700">Serving Mackenzie Health communities</p>
                </div>
                  </li>
                </ul>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="card p-8 shadow-lg">
                <h3 className="text-xl font-bold text-green-900 mb-6">Send Us a Message</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-green-800 mb-1 text-sm font-medium" htmlFor="name">Name</label>
                    <input type="text" id="name" className="field" placeholder="Your name" />
                  </div>
            <div>
                    <label className="block text-green-800 mb-1 text-sm font-medium" htmlFor="email">Email</label>
                <input
                  type="email"
                      id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field"
                      placeholder="Your email address" 
                />
                  </div>
                  <div>
                    <label className="block text-green-800 mb-1 text-sm font-medium" htmlFor="message">Message</label>
                    <textarea id="message" className="field min-h-[120px] resize-none" placeholder="How can we help?"></textarea>
                  </div>
                <button 
                  type="submit"
                    onClick={handleSubscribe}
                    className="btn btn-primary w-full"
                >
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
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