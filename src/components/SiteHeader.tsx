'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function SiteHeader() {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleDashboardClick = () => {
    router.push('/dashboard');
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-zinc-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" aria-label="The Giving Tree home" className="flex items-center">
              <Leaf className="h-7 w-7 text-emerald-600" />
              <span className="ml-2 text-lg font-semibold tracking-tight text-zinc-900">
                The Giving Tree
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/mission" className="nav-link">Mission</Link>
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/team" className="nav-link">Team</Link>
            <Link href="/events" className="nav-link">Events</Link>
            <Link href="/donate" className="nav-link">Donate</Link>
            <Link href="/leaderboard" className="nav-link">Leaderboard</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handleDashboardClick}
              className="btn btn-primary"
              aria-label={user ? 'Open dashboard' : 'Sign in'}
            >
              {user ? 'Dashboard' : 'Sign In'}
            </button>
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-zinc-700 hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-zinc-200 bg-white shadow-lg">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="grid gap-2">
              <Link href="/" className="mobile-link">Home</Link>
              <Link href="/mission" className="mobile-link">Mission</Link>
              <Link href="/about" className="mobile-link">About</Link>
              <Link href="/team" className="mobile-link">Team</Link>
              <Link href="/events" className="mobile-link">Events</Link>
              <Link href="/donate" className="mobile-link">Donate</Link>
              <Link href="/leaderboard" className="mobile-link">Leaderboard</Link>
              <Link href="/contact" className="mobile-link">Contact</Link>
              <button onClick={handleDashboardClick} className="mt-2 w-full btn btn-primary py-3">
                {user ? 'Dashboard' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


