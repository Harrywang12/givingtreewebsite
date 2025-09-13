'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Package, 
  Users, 
  Menu, 
  X, 
  Home,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';

export default function SiteHeader() {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Handle scroll events to create a dynamic header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDashboardClick = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 
      ${scrolled 
        ? 'backdrop-blur-md bg-white/95 shadow-md' 
        : 'bg-transparent'}`}>
      
      {/* Decorative top border with gradient */}
      <div className="h-1 w-full bg-gradient-to-r from-green-300 via-green-600 to-green-400"></div>
      
      {/* Subtle leaf pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 20a1 1 0 0 1 1 1v38a1 1 0 0 1-1 1 1 1 0 0 1-1-1V21a1 1 0 0 1 1-1zm15-10a1 1 0 0 1 1 1v38a1 1 0 0 1-1 1 1 1 0 0 1-1-1V11a1 1 0 0 1 1-1zm-30 20a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1 1 0 0 1-1-1V31a1 1 0 0 1 1-1z' fill='%234caf50'/%3E%3Cpath d='M30 0C19 0 5.3 12.5 0 30c5.3 17.5 19 30 30 30s24.7-12.5 30-30C54.7 12.5 41 0 30 0zm0 15c8.3 0 15 6.7 15 15s-6.7 15-15 15S15 38.3 15 30s6.7-15 15-15z' fill='%234caf50' fill-opacity='.05'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}>
      </div>

      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 relative">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="The Giving Tree Logo"
                width={60}
                height={60}
                className="w-16 h-16"
              />
              <span className="text-xl font-bold text-green-900">The Giving Tree</span>
            </Link>
          </div>

          {/* Medium screens - simplified nav */}
          <nav className="hidden md:flex lg:hidden items-center gap-1">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/team" className="nav-link">Team</Link>
            <Link href="/announcements" className="nav-link">News</Link>
            <Link href="/donors" className="nav-link">Donors</Link>
            <Link
              href="/donate"
              className="nav-link flex items-center bg-green-600 text-white hover:bg-green-700 rounded-lg px-3 py-1.5 text-sm"
            >
              <Heart className="h-3.5 w-3.5 mr-1" />
              <span>Donate</span>
            </Link>
          </nav>

          {/* Large screens - full nav with dropdown */}
          <nav className="hidden lg:flex items-center gap-2">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/team" className="nav-link">Team</Link>
            
            {/* Dropdown for Community */}
            <div className="relative group">
              <button className="nav-link flex items-center">
                Community
                <svg className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-green-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link href="/announcements" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">Announcements</Link>
                  <Link href="/past-events" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">Past Events</Link>
                  <Link href="/catalogue" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">Catalogue</Link>
                  <Link href="/donors" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">Our Donors</Link>
                  <Link href="/volunteer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">Volunteer</Link>
                </div>
              </div>
            </div>
            
            <Link
              href="/donate"
              className="nav-link flex items-center bg-green-600 text-white hover:bg-green-700 rounded-lg px-4 py-2 transition-colors"
            >
              <Heart className="h-4 w-4 mr-1" />
              <span>Donate</span>
            </Link>
            <Link href="/contact" className="nav-link">Contact</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handleDashboardClick}
              className="btn btn-primary group"
              aria-label={user ? 'Open dashboard' : 'Sign in'}
            >
                              <span className="mr-1.5 relative">
                  <Shield className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-100 opacity-30"></span>
                </span>
              {user ? 'Dashboard' : 'Sign In'}
            </button>
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center rounded-full p-2.5 text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 transition-all"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white shadow-lg border-t border-green-100 rounded-b-xl mx-2 will-change-transform">
          <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
            <div className="grid gap-1 relative">
              {/* Decorative leaf pattern */}
              <div className="absolute top-0 right-0 w-40 h-40 opacity-5 pointer-events-none">
                <Image 
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234caf50'%3E%3Cpath d='M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C16 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z'/%3E%3C/svg%3E"
                  width={160}
                  height={160}
                  alt=""
                />
              </div>

              <Link href="/" className="mobile-link" onClick={() => setOpen(false)}>Home</Link>
              <Link href="/about" className="mobile-link" onClick={() => setOpen(false)}>About</Link>
              <Link href="/team" className="mobile-link" onClick={() => setOpen(false)}>Team</Link>
              
              {/* Mobile Community Section */}
              <div className="px-4 py-2">
                <h3 className="text-sm font-semibold text-green-800 mb-2">Community</h3>
                <div className="pl-4 space-y-1">
                  <Link href="/announcements" className="block py-2 text-sm text-gray-600 hover:text-green-700 transition-colors" onClick={() => setOpen(false)}>Announcements</Link>
                  <Link href="/past-events" className="block py-2 text-sm text-gray-600 hover:text-green-700 transition-colors" onClick={() => setOpen(false)}>Past Events</Link>
                  <Link href="/catalogue" className="block py-2 text-sm text-gray-600 hover:text-green-700 transition-colors" onClick={() => setOpen(false)}>Catalogue</Link>
                  <Link href="/donors" className="block py-2 text-sm text-gray-600 hover:text-green-700 transition-colors" onClick={() => setOpen(false)}>Our Donors</Link>
                  <Link href="/volunteer" className="block py-2 text-sm text-gray-600 hover:text-green-700 transition-colors" onClick={() => setOpen(false)}>Volunteer</Link>
                </div>
              </div>
              
              <Link
                href="/donate"
                className="mobile-link flex items-center bg-green-600 text-white hover:bg-green-700 rounded-lg mx-4 my-2"
                onClick={() => setOpen(false)}
              >
                <Heart className="h-4 w-4 mr-2" />
                <span>Donate</span>
              </Link>
              <Link href="/contact" className="mobile-link" onClick={() => setOpen(false)}>Contact</Link>
              <div className="mt-3 pt-3 border-t border-green-100">
                <button 
                  onClick={() => { setOpen(false); handleDashboardClick(); }} 
                  className="w-full btn btn-primary flex items-center justify-center"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  {user ? 'Dashboard' : 'Sign In'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          mode="login"
        />
      )}
    </header>
  );
}

