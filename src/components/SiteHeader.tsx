'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Leaf, Menu, X, Sprout, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function SiteHeader() {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll events to create a dynamic header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDashboardClick = () => {
    router.push('/dashboard');
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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="The Giving Tree home" className="flex items-center group">
              <div className="relative overflow-hidden rounded-full bg-green-50 p-2 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:bg-green-100">
                <Leaf className="h-8 w-8 text-green-600 transition-transform duration-500 group-hover:scale-110" />
                <span className="absolute inset-0 bg-gradient-to-br from-green-100 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300"></span>
              </div>
              <div className="ml-3 flex flex-col">
                <span className="text-xl font-bold tracking-tight text-green-900 leading-none">
                  The Giving Tree
                </span>
                <span className="text-xs text-green-600 opacity-80">Growing Community Together</span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/mission" className="nav-link">Mission</Link>
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/team" className="nav-link">Team</Link>
            <Link href="/events" className="nav-link">Events</Link>
            <Link href="/volunteer" className="nav-link">Volunteer</Link>
            <Link href="/donate" className="nav-link flex items-center">
              <Heart className="h-3.5 w-3.5 mr-1 text-green-600" />
              <span>Donate</span>
            </Link>
            <Link href="/leaderboard" className="nav-link">Leaderboard</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handleDashboardClick}
              className="btn btn-primary group"
              aria-label={user ? 'Open dashboard' : 'Sign in'}
            >
              <span className="mr-1.5 relative">
                <Sprout className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-100 opacity-30"></span>
              </span>
              {user ? 'Dashboard' : 'Sign In'}
            </button>
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center rounded-full p-2 text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 transition-all"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white shadow-lg border-t border-green-100 rounded-b-xl mx-2">
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

              <Link href="/" className="mobile-link">Home</Link>
              <Link href="/mission" className="mobile-link">Mission</Link>
              <Link href="/about" className="mobile-link">About</Link>
              <Link href="/team" className="mobile-link">Team</Link>
              <Link href="/events" className="mobile-link">Events</Link>
              <Link href="/volunteer" className="mobile-link">Volunteer</Link>
              <Link href="/donate" className="mobile-link flex items-center">
                <Heart className="h-4 w-4 mr-2 text-green-600" />
                <span>Donate</span>
              </Link>
              <Link href="/leaderboard" className="mobile-link">Leaderboard</Link>
              <Link href="/contact" className="mobile-link">Contact</Link>
              <div className="mt-3 pt-3 border-t border-green-100">
                <button 
                  onClick={handleDashboardClick} 
                  className="w-full btn btn-primary flex items-center justify-center"
                >
                  <Sprout className="h-5 w-5 mr-2" />
                  {user ? 'Dashboard' : 'Sign In'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

