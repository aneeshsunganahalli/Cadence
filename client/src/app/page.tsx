'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChartBar, CreditCard, LineChart, Shield, Wallet, Plus, ArrowUpRight, ShoppingCart, Wifi, Briefcase, Bell } from 'lucide-react';
import MiniDashboard from '@/components/MiniDashboard';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative pt-20 pb-32 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="z-10"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Manage Your Finances with Precision
            </h1>
            <p className="mt-6 text-lg text-zinc-400 max-w-lg">
              Track expenses, visualize spending patterns, and grow your savings with powerful analytics and intuitive design.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/sign-up"
                className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-medium text-center hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-900/20"
              >
                Get Started
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-3.5 border border-zinc-700 rounded-xl text-white font-medium flex items-center justify-center hover:bg-zinc-800/50 transition-all duration-300 gap-2 group"
              >
                View Demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Hero Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative hidden md:block"
          >
            <MiniDashboard />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0, duration: 0.5 }}
              className="absolute -top-8 -left-8 bg-[#0D0D10] p-3 rounded-lg border border-zinc-800 shadow-lg rotate-[-8deg]"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400">Budget Alert</div>
                  <div className="text-sm font-medium text-white">Shopping: 92% used</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Background Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10"></div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-6 md:px-12 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Powerful Financial Tools
            </h2>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
              Everything you need to take control of your finances in one elegant platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#0D0D10] p-6 rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                <ChartBar className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Expense Tracking</h3>
              <p className="text-zinc-400">
                Categorize and monitor your spending with detailed breakdowns and custom tags.
              </p>
            </motion.div>

            {/* Feature Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-[#0D0D10] p-6 rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Visual Analytics</h3>
              <p className="text-zinc-400">
                Powerful charts and graphs that reveal spending patterns and financial trends.
              </p>
            </motion.div>

            {/* Feature Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-[#0D0D10] p-6 rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Budget Planning</h3>
              <p className="text-zinc-400">
                Create personalized budgets and receive alerts when approaching limits.
              </p>
            </motion.div>

            {/* Feature Card 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-[#0D0D10] p-6 rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-rose-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Payment Tracking</h3>
              <p className="text-zinc-400">
                Track different payment methods and visualize where your money goes.
              </p>
            </motion.div>

            {/* Feature Card 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-[#0D0D10] p-6 rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure Data</h3>
              <p className="text-zinc-400">
                Your financial data is encrypted and protected with industry-leading security.
              </p>
            </motion.div>

            {/* Feature Card 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-6 rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Ready to Start?</h3>
              <p className="text-zinc-400 mb-4">
                Join thousands of users taking control of their finances today.
              </p>
              <Link
                href="/sign-up"
                className="flex items-center font-medium text-blue-400 hover:text-blue-300 transition-colors group"
              >
                Create an account
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Testimonial/Stats Section */}
      <div className="py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto bg-[#0D0D10]/80 rounded-2xl border border-zinc-800/50 p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Financial Freedom at Your Fingertips</h2>
              <p className="text-zinc-400 mb-6">
                Cadence gives you the tools to understand your spending habits, track your savings goals,
                and make better financial decisions - all in one elegant application.
              </p>
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-medium inline-flex items-center hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-900/20"
              >
                Explore Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0D0D10] p-5 rounded-xl border border-zinc-800/50">
                <p className="text-3xl font-bold text-emerald-400">87%</p>
                <p className="text-zinc-400 text-sm mt-1">Users report better spending habits</p>
              </div>
              <div className="bg-[#0D0D10] p-5 rounded-xl border border-zinc-800/50">
                <p className="text-3xl font-bold text-blue-400">₹12.6M</p>
                <p className="text-zinc-400 text-sm mt-1">User savings tracked monthly</p>
              </div>
              <div className="bg-[#0D0D10] p-5 rounded-xl border border-zinc-800/50">
                <p className="text-3xl font-bold text-purple-400">28%</p>
                <p className="text-zinc-400 text-sm mt-1">Average spending reduction</p>
              </div>
              <div className="bg-[#0D0D10] p-5 rounded-xl border border-zinc-800/50">
                <p className="text-3xl font-bold text-amber-400">5,400+</p>
                <p className="text-zinc-400 text-sm mt-1">Active daily users</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6 md:px-12 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto">
            Join Cadence today and discover a smarter way to manage your money, track expenses, and achieve your financial goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-900/20"
            >
              Create Account
            </Link>
            <Link
              href="/sign-in"
              className="px-8 py-3.5 border border-zinc-700 rounded-xl text-white font-medium hover:bg-zinc-800/50 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black to-transparent z-0"></div>
      </div>
    </div>
  );
}
