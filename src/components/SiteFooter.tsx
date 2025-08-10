import Link from 'next/link';
import Image from 'next/image';
import { Leaf, Mail, MapPin, Phone, Heart, Instagram, Facebook, Twitter } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="mt-24 relative overflow-hidden">
      {/* Decorative top wave pattern */}
      <div className="absolute top-0 left-0 w-full h-12 overflow-hidden">
        <svg className="absolute top-0 w-full h-24 text-green-50" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none">
          <path 
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
            fill="currentColor">
          </path>
        </svg>
      </div>

      {/* Natural gradient background */}
      <div className="bg-gradient-to-b from-green-50 to-green-100 pt-20 pb-10 relative">
        {/* Scattered leaf decorations */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M30 0C19 0 5.3 12.5 0 30c5.3 17.5 19 30 30 30s24.7-12.5 30-30C54.7 12.5 41 0 30 0zm0 50c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z' fill='%234caf50' fill-opacity='.1'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="grid gap-12 md:grid-cols-4 relative z-10">
            <div className="relative">
              {/* Logo section */}
              <div className="flex items-start mb-6">
                <div className="relative overflow-hidden rounded-full bg-white p-3 shadow-md">
                  <Leaf className="h-8 w-8 text-green-600" />
                  <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-transparent opacity-30"></div>
                </div>
                <div className="ml-3">
                  <span className="block text-xl font-bold text-green-900 font-serif">The Giving Tree</span>
                  <span className="block text-sm text-green-700">Foundation</span>
                </div>
              </div>
              
              <p className="text-base leading-relaxed text-green-800">
                Supporting healthcare through community generosity. 100% of proceeds go directly to Mackenzie Health.
              </p>

              {/* Social media links */}
              <div className="mt-6 flex space-x-3">
                <a href="#" className="flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-sm hover:shadow-md hover:bg-green-50 transition-all duration-300">
                  <Facebook className="h-5 w-5 text-green-700" />
                </a>
                <a href="#" className="flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-sm hover:shadow-md hover:bg-green-50 transition-all duration-300">
                  <Instagram className="h-5 w-5 text-green-700" />
                </a>
                <a href="#" className="flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-sm hover:shadow-md hover:bg-green-50 transition-all duration-300">
                  <Twitter className="h-5 w-5 text-green-700" />
                </a>
              </div>
            </div>

            {/* Quick Links section */}
            <div>
              <h4 className="mb-5 text-base font-bold text-green-900 flex items-center">
                <span className="inline-block w-8 h-0.5 bg-green-500 mr-2"></span>
                Quick Links
              </h4>
              <ul className="space-y-3 text-base text-green-800">
                <li>
                  <Link href="/mission" className="footer-link flex items-center">
                    <span className="h-1 w-1 rounded-full bg-green-500 mr-2"></span>
                    Mission
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="footer-link flex items-center">
                    <span className="h-1 w-1 rounded-full bg-green-500 mr-2"></span>
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/team" className="footer-link flex items-center">
                    <span className="h-1 w-1 rounded-full bg-green-500 mr-2"></span>
                    Team
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="footer-link flex items-center">
                    <span className="h-1 w-1 rounded-full bg-green-500 mr-2"></span>
                    Events
                  </Link>
                </li>
              </ul>
            </div>

            {/* Get Involved section */}
            <div>
              <h4 className="mb-5 text-base font-bold text-green-900 flex items-center">
                <span className="inline-block w-8 h-0.5 bg-green-500 mr-2"></span>
                Get Involved
              </h4>
              <ul className="space-y-3 text-base text-green-800">
                <li>
                  <Link href="/donate" className="footer-link inline-flex items-center align-middle">
                    <Heart className="h-4 w-4 mr-2 text-green-600 inline-block align-middle" />
                    <span className="inline-block align-middle">Donate</span>
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="footer-link flex items-center">
                    <span className="h-1 w-1 rounded-full bg-green-500 mr-2"></span>
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="footer-link flex items-center">
                    <span className="h-1 w-1 rounded-full bg-green-500 mr-2"></span>
                    Volunteer
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact section */}
            <div>
              <h4 className="mb-5 text-base font-bold text-green-900 flex items-center">
                <span className="inline-block w-8 h-0.5 bg-green-500 mr-2"></span>
                Contact
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <Mail className="h-4 w-4 text-green-700" />
                  </div>
                  <span className="ml-3 text-base text-green-800">Givingtreenonprofit@gmail.com</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <Phone className="h-4 w-4 text-green-700" />
                  </div>
                  <span className="ml-3 text-base text-green-800">(905) 883-1212</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <MapPin className="h-4 w-4 text-green-700" />
                  </div>
                  <span className="ml-3 text-base text-green-800">Serving Mackenzie Health communities</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter sign-up */}
          <div className="mt-16 mb-8 bg-white rounded-xl p-6 shadow-md max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 opacity-5">
              <Image 
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234caf50'%3E%3Cpath d='M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C16 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z'/%3E%3C/svg%3E"
                width={160}
                height={160}
                alt=""
              />
            </div>

            <h3 className="text-xl font-bold text-green-900 mb-2">Join Our Community</h3>
            <p className="text-green-700 mb-4">Subscribe to receive updates on our impact and upcoming events.</p>
            
            <form className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="field flex-1" 
                required 
              />
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="mt-10 pt-6 border-t border-green-200 text-center text-green-700">
            <p className="mb-4">© {new Date().getFullYear()} The Giving Tree Foundation. All rights reserved.</p>
            
            {/* Simple leaf decoration */}
            <div className="mx-auto w-8 h-8 opacity-50">
              <Leaf className="h-8 w-8 text-green-600 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

