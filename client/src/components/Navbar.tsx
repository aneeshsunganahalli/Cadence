'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/types';
import { useDispatch } from 'react-redux';
import { signOutFailure, signOutStart, signOutSuccess } from '@/redux/user/userSlice';
import { toast } from 'react-toastify';

const NavLinks = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/contact', label: 'Contact' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const {currentUser} = useAppSelector((state: RootState) => state.user)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menuButton = document.querySelector('[aria-label="Toggle menu"]');
      if (isMobileMenuOpen && menuButton && !menuButton.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const logout = async () => {
    try {
      dispatch(signOutStart());

      localStorage.removeItem('token');
      dispatch(signOutSuccess());

      toast.success("Signed Out");
    } catch (error) {
      dispatch(signOutFailure(error instanceof Error ? error.message : 'An error occurred'));
    }
  }
  return (
    <nav
      className={` w-full z-50 transition-all duration-300 bg-black py-4`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-gray-500 to-black flex items-center justify-center overflow-hidden transform transition-transform group-hover:scale-110">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-medium bg-gradient-to-r text-white bg-clip-text text-transparent">
              Cadence
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex border border-gray-500 rounded-full p-1 mr-6">
              {NavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${pathname === link.href
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <AnimatePresence mode="wait">
                    {pathname === link.href && (
                      <motion.span
                        className="absolute inset-0 bg-gray-600 rounded-full -z-10"
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      />
                    )}
                  </AnimatePresence>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            {
              currentUser ?
              (
                <div className='flex items-center gap-2'>
                  <Link
                  onClick={() => logout()}
                    href="/sign-in"
                    className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-black rounded-full hover:shadow-lg hover:shadow-gray-500/20 transition-all duration-200"
                  >
                    Logout
                </Link>
                <img src={currentUser.avatar} className='w-8 h-8 mx-auto rounded-3xl' />
                </div>
                ):(
                  
                  <div className="flex items-center space-x-1">
                  <Link
                      href="/sign-in"
                      className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-black rounded-full hover:shadow-lg hover:shadow-gray-500/20 transition-all duration-200"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/sign-up"
                      className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-black rounded-full hover:shadow-lg hover:shadow-gray-500/20 transition-all duration-200"
                    >
                      Get Started
                    </Link>
                  </div>
                )
            }
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-800/10 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span
                  className={`absolute top-1/2 left-0 w-6 h-0.5 bg-white transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45' : '-translate-y-2'
                    }`}
                />
                <span
                  className={`absolute top-1/2 left-0 w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                />
                <span
                  className={`absolute top-1/2 left-0 w-6 h-0.5 bg-white transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45' : 'translate-y-2'
                    }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0  bg-black/50 backdrop-blur-sm z-40"
          >
            <div className="fixed top-[4.5rem] right-4 left-4 bg-white shadow-lg rounded-2xl overflow-hidden">
              <div className="p-4 top-[4.5rem] space-y-1">
                {NavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === link.href
                        ? 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-600'
                        : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 space-y-2">
                  <Link
                    href="/sign-in"
                    className="block w-full px-4 py-3 text-center text-gray-600 hover:bg-gray-50 rounded-xl font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/sign-up"
                    className="block w-full px-4 py-3 text-center text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}