import React from 'react';
import { motion } from 'framer-motion';
import ExpensePieChart from '@/components/Overview/ExpensePieChart';

interface MonthlyComparisonGridProps {
  months: string[];
  monthlyData: Record<string, any[]>;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

const MonthlyComparisonGrid: React.FC<MonthlyComparisonGridProps> = ({
  months,
  monthlyData,
  selectedMonth,
  setSelectedMonth
}) => {
  return (
    <div className="bg-[#0D0D10] rounded-xl border border-zinc-800/50">
      <div className="p-5 border-b border-zinc-800/70">
        <h2 className="text-lg font-medium text-white">Compare Across Months</h2>
      </div>
      <div className="p-6 max-h-[800px] overflow-y-auto">
        <div className="grid gap-6">
          {months.map((month, index) => (
            <motion.div 
              key={month}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => setSelectedMonth(month)}
              className={`p-5 rounded-xl border ${
                selectedMonth === month 
                  ? 'border-blue-500/50 bg-blue-900/10' 
                  : 'border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/30'
              } transition-colors cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">{month}</h3>
                {selectedMonth === month && (
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                    Selected
                  </span>
                )}
              </div>
              
              <div className="w-full flex justify-center">
                {monthlyData[month]?.length ? (
                  <ExpensePieChart data={monthlyData[month]} />
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-zinc-400">No expense data available for this month</p>
                  </div>
                )}
              </div>
              
              {monthlyData[month]?.length > 0 && (
                <div className="mt-4 flex justify-between text-center">
                  <div className="w-1/2">
                    <p className="text-xs text-zinc-500">Top Category</p>
                    <p className="text-sm text-white">
                      {monthlyData[month].sort((a, b) => b.value - a.value)[0].name}
                    </p>
                  </div>
                  <div className="w-1/2">
                    <p className="text-xs text-zinc-500">Total</p>
                    <p className="text-sm text-white">
                      ₹{monthlyData[month].reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthlyComparisonGrid;