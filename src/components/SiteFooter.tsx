import Link from 'next/link';
import { Leaf, Mail, MapPin, Phone } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-zinc-200 bg-gradient-to-b from-white to-emerald-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center mb-4">
              <Leaf className="h-7 w-7 text-emerald-600" />
              <span className="ml-2 text-lg font-semibold text-zinc-900">The Giving Tree</span>
            </div>
            <p className="text-sm leading-6 text-zinc-600">
              Supporting healthcare through community generosity. 100% of proceeds go to Mackenzie Health.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold tracking-wide text-zinc-900">Quick Links</h4>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li><Link href="/mission" className="footer-link">Mission</Link></li>
              <li><Link href="/about" className="footer-link">About</Link></li>
              <li><Link href="/team" className="footer-link">Team</Link></li>
              <li><Link href="/events" className="footer-link">Events</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold tracking-wide text-zinc-900">Get Involved</h4>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li><Link href="/donate" className="footer-link">Donate</Link></li>
              <li><Link href="/leaderboard" className="footer-link">Leaderboard</Link></li>
              <li><Link href="/dashboard" className="footer-link">Volunteer</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold tracking-wide text-zinc-900">Contact</h4>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-emerald-600" /> Givingtreenonprofit@gmail.com</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-emerald-600" /> (905) 883-1212</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-600" /> Serving Mackenzie Health communities</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} The Giving Tree Foundation. All rights reserved.
        </div>
      </div>
    </footer>
  );
}


