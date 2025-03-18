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
import Image from 'next/image';

const NavLinks = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/transactions', label: 'Transactions' },
  { href: '/statistics', label: 'Statistics' },
];

export default function Navbar() {
  const { currentUser } = useAppSelector((state: RootState) => state.user);
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

  // Close menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const logout = async () => {
    try {
      dispatch(signOutStart());
      localStorage.removeItem('token');
      dispatch(signOutSuccess());
      toast.success("Signed Out");
    } catch (error) {
      dispatch(signOutFailure(error instanceof Error ? error.message : 'An error occurred'));
    }
  };

  return (
    <nav className={`w-full z-50 transition-all duration-300 bg-transparent py-4 ${scrolled ? 'bg-black/20 backdrop-blur-lg' : ''}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-gray-500 to-black flex items-center justify-center overflow-hidden transform transition-transform group-hover:scale-110">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-medium bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
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
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    pathname === link.href ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {pathname === link.href && (
                      <motion.span
                        className="absolute inset-0 bg-gray-900 rounded-full -z-10"
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

            {/* Desktop Auth Buttons */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={logout}
                  className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-black rounded-full hover:shadow-lg hover:shadow-gray-500/20 transition-all duration-200"
                >
                  Logout
                </button>
                {currentUser.avatar && (
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image 
                      src={currentUser.avatar} 
                      alt="Profile" 
                      width={24}
                      height={24}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <Link
                  href="/auth/sign-in"
                  className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-black rounded-full hover:shadow-lg hover:shadow-gray-500/20 transition-all duration-200"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-black rounded-full hover:shadow-lg hover:shadow-gray-500/20 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
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
                  className={`absolute top-1/2 left-0 w-6 h-0.5 bg-white transform transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45' : '-translate-y-2'
                  }`}
                />
                <span
                  className={`absolute top-1/2 left-0 w-6 h-0.5 bg-white transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`absolute top-1/2 left-0 w-6 h-0.5 bg-white transform transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45' : 'translate-y-2'
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          >
            <div className="fixed top-[4.5rem] right-4 left-4 bg-white shadow-lg rounded-2xl overflow-hidden">
              <div className="p-4 space-y-1">
                {NavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {/* Mobile Auth Buttons - Updated to match auth state like desktop */}
                <div className="pt-3 space-y-2">
                  {currentUser ? (
                    <>
                      <div className="flex items-center gap-2 px-4 py-2">
                        {currentUser.avatar && (
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <img 
                              src={currentUser.avatar} 
                              alt="Profile" 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        )}
                        <span className="text-gray-700 font-medium">{currentUser.username || 'User'}</span>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full px-4 py-3 text-center text-white bg-gradient-to-r from-gray-600 to-black rounded-xl font-medium"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/sign-in"
                        className="block w-full px-4 py-3 text-center text-gray-600 hover:bg-gray-50 rounded-xl font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/auth/sign-up"
                        className="block w-full px-4 py-3 text-center text-white bg-gradient-to-r from-gray-600 to-black rounded-xl font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}