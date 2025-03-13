'use client';

import { motion } from 'framer-motion';
import { Wallet, ArrowUpRight, CreditCard, ShoppingCart, Wifi, Briefcase } from 'lucide-react';

const MiniDashboard: React.FC = () => {
  return (
    <div className="relative bg-[#0A0A0F] rounded-2xl border border-zinc-800 shadow-2xl shadow-blue-900/10 overflow-hidden w-full">
      {/* Browser-like Top Bar */}
      <div className="bg-[#121217] flex items-center gap-2 py-2 px-3 border-b border-zinc-800">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
        </div>
        <div className="mx-auto bg-[#17171E] rounded-md py-1 px-3 text-xs text-zinc-400 flex items-center gap-2 w-64">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
          <span>app.cadence.finance</span>
        </div>
        <div className="w-4"></div>
      </div>

      {/* Dashboard Content Layout */}
      <div className="grid grid-cols-12 gap-2 p-3">
        {/* Left Column - Summary and Chart */}
        <div className="col-span-8 space-y-2">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-2">
            {/* Balance Card */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="bg-[#121217] rounded-md border border-zinc-800/60 p-2"
            >
              <div className="flex justify-between items-center mb-1">
                <div className="text-[10px] text-zinc-500">Balance</div>
                <div className="h-4 w-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Wallet className="h-2.5 w-2.5 text-blue-400" />
                </div>
              </div>
              <div className="text-base font-bold text-white">₹235,400</div>
              <div className="flex items-center text-[10px] font-medium text-emerald-400">
                <ArrowUpRight className="h-2 w-2 mr-0.5" />
                <span>12.8%</span>
              </div>
            </motion.div>

            {/* Income Card */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="bg-[#121217] rounded-md border border-zinc-800/60 p-2"
            >
              <div className="flex justify-between items-center mb-1">
                <div className="text-[10px] text-zinc-500">Income</div>
                <div className="h-4 w-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <ArrowUpRight className="h-2.5 w-2.5 text-emerald-400" />
                </div>
              </div>
              <div className="text-base font-bold text-white">₹186,200</div>
              <div className="flex items-center text-[10px] font-medium text-emerald-400">
                <ArrowUpRight className="h-2 w-2 mr-0.5" />
                <span>8.3%</span>
              </div>
            </motion.div>

            {/* Expenses Card */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.4 }}
              className="bg-[#121217] rounded-md border border-zinc-800/60 p-2"
            >
              <div className="flex justify-between items-center mb-1">
                <div className="text-[10px] text-zinc-500">Expenses</div>
                <div className="h-4 w-4 rounded-full bg-rose-500/10 flex items-center justify-center">
                  <ArrowUpRight className="h-2.5 w-2.5 text-rose-400 transform rotate-90" />
                </div>
              </div>
              <div className="text-base font-bold text-white">₹82,450</div>
              <div className="flex items-center text-[10px] font-medium text-rose-400">
                <ArrowUpRight className="h-2 w-2 mr-0.5 transform rotate-90" />
                <span>5.2%</span>
              </div>
            </motion.div>

            {/* Savings Card */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.4 }}
              className="bg-[#121217] rounded-md border border-zinc-800/60 p-2"
            >
              <div className="flex justify-between items-center mb-1">
                <div className="text-[10px] text-zinc-500">Savings</div>
                <div className="h-4 w-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <CreditCard className="h-2.5 w-2.5 text-purple-400" />
                </div>
              </div>
              <div className="text-base font-bold text-white">56.8%</div>
              <div className="flex items-center text-[10px] font-medium text-purple-400">
                <ArrowUpRight className="h-2 w-2 mr-0.5" />
                <span>3.5%</span>
              </div>
            </motion.div>
          </div>

          {/* Chart Area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="bg-[#121217] rounded-md border border-zinc-800/60 p-3 relative overflow-hidden"
          >
            {/* Chart Header */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-medium text-white">Monthly Overview</h3>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400"></div>
                <span className="text-[10px] text-zinc-400">Income</span>
                <div className="h-1.5 w-1.5 rounded-full bg-rose-400 ml-1.5"></div>
                <span className="text-[10px] text-zinc-400">Expenses</span>
              </div>
            </div>

            {/* Chart Visualization */}
            <div className="relative h-28">
              {/* Chart Grid */}
              <div className="absolute inset-0 grid grid-rows-3">
                <div className="border-t border-dashed border-zinc-800/50"></div>
                <div className="border-t border-dashed border-zinc-800/50"></div>
                <div className="border-t border-dashed border-zinc-800/50"></div>
              </div>

              {/* Y-axis Labels */}
              <div className="absolute left-0 top-0 bottom-0 w-6 flex flex-col justify-between">
                <div className="text-[8px] text-zinc-500 -translate-y-1">150k</div>
                <div className="text-[8px] text-zinc-500">100k</div>
                <div className="text-[8px] text-zinc-500">50k</div>
                <div className="text-[8px] text-zinc-500 translate-y-1">0</div>
              </div>

              {/* Chart Data */}
<div className="absolute left-6 right-0 top-0 bottom-0 flex items-end justify-around">
  {[
    { month: 'Jan', income: 65, expense: 40 },
    { month: 'Feb', income: 80, expense: 55 },
    { month: 'Mar', income: 60, expense: 35 },
    { month: 'Apr', income: 85, expense: 60 },
    { month: 'May', income: 95, expense: 50 },
    { month: 'Jun', income: 75, expense: 45 }
  ].map((data, i) => (
    <div key={data.month} className="flex flex-col items-center w-1/6">
      {/* Bars Container - Changed to flex-row */}
      <div className="flex flex-row items-end gap-1 mb-1">
        {/* Income Bar */}
        <div className="relative w-2 h-20">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${data.income * 0.8}px` }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-0 w-full bg-green-400 rounded-sm"
            style={{ backgroundImage: 'linear-gradient(to top, #059669, #34d399)' }}
          ></motion.div>
        </div>

        {/* Expense Bar */}
        <div className="relative w-2 h-20">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${data.expense * 0.8}px` }}
            transition={{ delay: 0.3 + (i * 0.05), duration: 0.6 }}
            className="absolute bottom-0 w-full bg-rose-400 rounded-sm"
            style={{ backgroundImage: 'linear-gradient(to top, #e11d48, #fb7185)' }}
          ></motion.div>
        </div>
      </div>

      {/* X-axis Label */}
      <div className="text-[8px] text-zinc-500 mt-0.5">{data.month}</div>
    </div>
  ))}
</div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Expenses and Transactions */}
        <div className="col-span-4 space-y-2">
          {/* Expenses Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 0.4 }}
            className="bg-[#121217] rounded-md border border-zinc-800/60 p-3 h-[100px]"
          >
            <h3 className="text-xs font-medium text-white mb-2">Expense Breakdown</h3>

            {/* Pie Chart Simulation */}
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full border-3 border-r-purple-500 border-t-blue-500 border-l-emerald-500 border-b-rose-500 rotate-45"></div>
              <div className="ml-2 space-y-1">
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                  <span className="text-[8px] text-zinc-400">Shopping 32%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  <span className="text-[8px] text-zinc-400">Bills 28%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                  <span className="text-[8px] text-zinc-400">Food 24%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-rose-500"></div>
                  <span className="text-[8px] text-zinc-400">Travel 16%</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6, duration: 0.4 }}
            className="bg-[#121217] rounded-md border border-zinc-800/60 p-3"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-medium text-white">Recent Transactions</h3>
              <button className="text-[8px] text-blue-400">View All</button>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between py-1 border-b border-zinc-800/50">
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 rounded-full bg-rose-500/10 flex items-center justify-center">
                    <ShoppingCart className="h-2 w-2 text-rose-400" />
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-200">Online Store</div>
                    <div className="text-[8px] text-zinc-500">Shopping</div>
                  </div>
                </div>
                <div className="text-[9px] text-rose-400 font-medium">-₹2,450</div>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-zinc-800/50">
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Wifi className="h-2 w-2 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-200">Internet Bill</div>
                    <div className="text-[8px] text-zinc-500">Utilities</div>
                  </div>
                </div>
                <div className="text-[9px] text-rose-400 font-medium">-₹1,200</div>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Briefcase className="h-2 w-2 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-200">Salary Deposit</div>
                    <div className="text-[8px] text-zinc-500">Income</div>
                  </div>
                </div>
                <div className="text-[9px] text-emerald-400 font-medium">+₹45,000</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default MiniDashboard;