import React, { useState } from 'react';
import {
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  ReferenceLine,
  ComposedChart,
  Scatter,
  ReferenceArea
} from 'recharts';
import { motion } from 'framer-motion';
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, BarChart3, Activity } from 'lucide-react';

// Define expense item type to replace 'any'
interface ExpenseItem {
  name: string;
  value: number;
  color?: string;
  // Add other properties that might exist in your expense items
}

interface ExpenseTrendChartProps {
  months: string[];
  // Replace 'any[]' with proper type
  monthlyData: Record<string, ExpenseItem[]>;
}

// Define the payload type for Scatter shape prop
interface ScatterPayload {
  name: string;
  year: string;
  total: number;
  growth: number;
  fullMonth: string;
}

const ExpenseTrendChart: React.FC<ExpenseTrendChartProps> = ({ months, monthlyData }) => {
  const [chartType, setChartType] = useState<'area' | 'trend'>('area');

  // Calculate trend data
  const chartData = months.slice().reverse().map((month, idx) => {
    const total = monthlyData[month]?.reduce((sum, cat) => sum + cat.value, 0) || 0;

    // Calculate growth from previous month (if applicable)
    let growth = 0;
    if (idx > 0) {
      const prevMonth = months.slice().reverse()[idx - 1];
      const prevTotal = monthlyData[prevMonth]?.reduce((sum, cat) => sum + cat.value, 0) || 0;
      growth = prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : 0;
    }

    return {
      name: month.split(' ')[0].substring(0, 3), // First 3 letters of month name
      year: month.split(' ')[1],
      total: total,
      growth: growth,
      fullMonth: month
    };
  });

  // Calculate average for reference line
  const average = chartData.reduce((sum, item) => sum + item.total, 0) / chartData.length;

  // Find highest and lowest months for highlighting
  const highestValue = Math.max(...chartData.map(item => item.total));
  const lowestValue = Math.min(...chartData.filter(item => item.total > 0).map(item => item.total));

  return (
    <motion.div
      className="bg-[#0D0D10] rounded-xl border border-zinc-800/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-5 border-b border-zinc-800/70">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-white">Expense Trend Over Time</h2>

          {/* Chart type toggle */}
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center ${chartType === 'area'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                  : 'text-zinc-400 hover:bg-zinc-800/80'
                }`}
              onClick={() => setChartType('area')}
            >
              <Activity className="w-3.5 h-3.5 mr-1.5" /> Area View
            </button>
            <button
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center ${chartType === 'trend'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                  : 'text-zinc-400 hover:bg-zinc-800/80'
                }`}
              onClick={() => setChartType('trend')}
            >
              <TrendingUp className="w-3.5 h-3.5 mr-1.5" /> Trend View
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {chartData.length > 0 && (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                    </linearGradient>
                    <filter id="shadow" height="200%">
                      <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#3B82F6" floodOpacity="0.5" />
                    </filter>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />

                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#a1a1aa', fontSize: 12 }}
                    axisLine={{ stroke: '#27272a' }}
                    tickLine={{ stroke: '#27272a' }}
                    tickFormatter={(value, index) => {
                      return `${value} ${chartData[index].year}`;
                    }}
                    height={60}
                    angle={-45}
                    textAnchor="end"
                  />

                  <YAxis
                    tick={{ fill: '#a1a1aa', fontSize: 12 }}
                    axisLine={{ stroke: '#27272a' }}
                    tickLine={{ stroke: '#27272a' }}
                    tickFormatter={(value) => `₹${value.toLocaleString()}`}
                  />

                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'total') return [`₹${Number(value).toLocaleString()}`, 'Total Expenses'];
                      if (name === 'growth') return [`${Number(value).toFixed(1)}%`, 'Monthly Change'];
                      return [value, name];
                    }}
                    labelFormatter={(label, payload) =>
                      payload && payload.length > 0 ? payload[0].payload.fullMonth : label
                    }
                    contentStyle={{
                      backgroundColor: '#1f1f23',
                      border: '1px solid #3f3f46',
                      borderRadius: '0.5rem',
                      color: '#f4f4f5',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  />

                  {/* Highlight highest & lowest months with reference areas */}
                  {chartData.map((entry, index) => {
                    if (entry.total === highestValue) {
                      return (
                        <ReferenceArea
                          key={`high-${index}`}
                          x1={entry.name}
                          x2={entry.name}
                          y1={0}
                          y2={entry.total}
                          fill="#3B82F6"
                          fillOpacity={0.1}
                          stroke="#3B82F6"
                          strokeOpacity={0.3}
                          strokeDasharray="3 3"
                        />
                      );
                    }
                    if (entry.total === lowestValue && entry.total > 0) {
                      return (
                        <ReferenceArea
                          key={`low-${index}`}
                          x1={entry.name}
                          x2={entry.name}
                          y1={0}
                          y2={entry.total}
                          fill="#10B981"
                          fillOpacity={0.1}
                          stroke="#10B981"
                          strokeOpacity={0.3}
                          strokeDasharray="3 3"
                        />
                      );
                    }
                    return null;
                  })}

                  {/* Reference line for average */}
                  <ReferenceLine
                    y={average}
                    stroke="#94A3B8"
                    strokeDasharray="3 3"
                    label={{
                      value: `Avg: ₹${Math.round(average).toLocaleString()}`,
                      position: 'insideTopRight',
                      fill: '#94A3B8',
                      fontSize: 12
                    }}
                  />

                  {/* Area underneath the line with gradient fill */}
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="none"
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                    animationDuration={1500}
                  />

                  {/* Main line with special styling for visual interest */}
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Total Expenses"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      strokeWidth: 2,
                      fill: '#0D0D10',
                      stroke: '#3B82F6'
                    }}
                    activeDot={{
                      r: 6,
                      strokeWidth: 0,
                      fill: '#3B82F6'
                    }}
                    animationDuration={1500}
                    filter="url(#shadow)"
                  />

                  {/* Special markers for growth/decline */}
                  <Scatter
                    dataKey="total"
                    shape={(props: {
                      cx?: number;
                      cy?: number;
                      r?: number;
                      payload?: ScatterPayload; // Use the specific type here instead of 'any'
                      fill?: string;
                      index?: number;
                    }) => {
                      const { cx, cy, payload } = props;
                      if (!payload) return <circle cx={cx} cy={cy} r={0} opacity={0} />;
                      
                      // Default value for cy if undefined
                      const yCord = cy ?? 0;
                      // Only show markers for significant changes
                      if (Math.abs(payload.growth) < 10) {
                        return <circle cx={cx} cy={yCord} r={0} opacity={0} />
                      };

                      return payload.growth > 0 ? (
                        <circle
                          cx={cx}
                          cy={yCord - 15}
                          r={3}
                          fill="#EF4444"
                          stroke="#0D0D10"
                          strokeWidth={1.5}
                        />
                      ) : (
                        <circle
                          cx={cx}
                          cy={yCord + 15}
                          r={3}
                          fill="#10B981"
                          stroke="#0D0D10"
                          strokeWidth={1.5}
                        />
                      );
                    }}
                  />
                </ComposedChart>
              ) : (
                // Alternative trend view showing month-to-month changes
                <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
                  <defs>
                    <linearGradient id="growthPositive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="growthNegative" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />

                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#a1a1aa', fontSize: 12 }}
                    axisLine={{ stroke: '#27272a' }}
                    tickLine={{ stroke: '#27272a' }}
                    tickFormatter={(value, index) => {
                      return `${value} ${chartData[index].year}`;
                    }}
                    height={60}
                    angle={-45}
                    textAnchor="end"
                  />

                  <YAxis
                    tick={{ fill: '#a1a1aa', fontSize: 12 }}
                    axisLine={{ stroke: '#27272a' }}
                    tickLine={{ stroke: '#27272a' }}
                    tickFormatter={(value) => `${value.toFixed(0)}%`}
                  />

                  <Tooltip
                    formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Monthly Change']}
                    labelFormatter={(label, payload) =>
                      payload && payload.length > 0 ? payload[0].payload.fullMonth : label
                    }
                    contentStyle={{
                      backgroundColor: '#1f1f23',
                      border: '1px solid #3f3f46',
                      borderRadius: '0.5rem',
                      color: '#f4f4f5'
                    }}
                  />

                  <ReferenceLine y={0} stroke="#64748B" />

                  {/* Growth bars - positive in red, negative in green */}
                  {chartData.map((entry, index) => {
                    if (index === 0) return null; // Skip first month as it has no growth data

                    return entry.growth > 0 ? (
                      <Area
                        key={`growth-pos-${index}`}
                        type="monotone"
                        dataKey="growth"
                        name="Growth"
                        stroke="#EF4444"
                        fill="url(#growthPositive)"
                        fillOpacity={0.6}
                        connectNulls
                        activeDot={{
                          r: 6,
                          stroke: '#EF4444',
                          strokeWidth: 1,
                          fill: '#1F2937'
                        }}
                      />
                    ) : (
                      <Area
                        key={`growth-neg-${index}`}
                        type="monotone"
                        dataKey="growth"
                        name="Decline"
                        stroke="#10B981"
                        fill="url(#growthNegative)"
                        fillOpacity={0.6}
                        connectNulls
                        activeDot={{
                          r: 6,
                          stroke: '#10B981',
                          strokeWidth: 1,
                          fill: '#1F2937'
                        }}
                      />
                    );
                  })}
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>
        )}

        {/* Enhanced insight cards */}
        <div className="mt-6 bg-zinc-900/40 rounded-lg border border-zinc-800 p-4">
          <h3 className="text-md font-medium text-white mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-blue-400" /> Spending Pattern Analysis
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900/60 p-4 rounded-md border border-zinc-800 flex items-start">
              <div className="p-2 bg-red-500/10 rounded-md mr-3">
                <ArrowUpCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-xs text-zinc-400">Highest Expense Month</p>
                {(() => {
                  const monthsWithData = months.filter(m => monthlyData[m]?.length > 0);
                  if (monthsWithData.length === 0) return <p className="text-sm text-white">No data</p>;

                  const highestMonth = monthsWithData.reduce((prev, curr) => {
                    const prevTotal = monthlyData[prev].reduce((sum, cat) => sum + cat.value, 0);
                    const currTotal = monthlyData[curr].reduce((sum, cat) => sum + cat.value, 0);
                    return prevTotal > currTotal ? prev : curr;
                  });

                  const total = monthlyData[highestMonth].reduce((sum, cat) => sum + cat.value, 0);

                  return (
                    <p className="text-sm text-white font-medium mt-1">
                      {highestMonth} - ₹{total.toLocaleString()}
                    </p>
                  );
                })()}
              </div>
            </div>

            <div className="bg-zinc-900/60 p-4 rounded-md border border-zinc-800 flex items-start">
              <div className="p-2 bg-green-500/10 rounded-md mr-3">
                <ArrowDownCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-zinc-400">Lowest Expense Month</p>
                {(() => {
                  const monthsWithData = months.filter(m => monthlyData[m]?.length > 0);
                  if (monthsWithData.length === 0) return <p className="text-sm text-white">No data</p>;

                  const lowestMonth = monthsWithData.reduce((prev, curr) => {
                    const prevTotal = monthlyData[prev].reduce((sum, cat) => sum + cat.value, 0);
                    const currTotal = monthlyData[curr].reduce((sum, cat) => sum + cat.value, 0);
                    return prevTotal < currTotal ? prev : curr;
                  });

                  const total = monthlyData[lowestMonth].reduce((sum, cat) => sum + cat.value, 0);

                  return (
                    <p className="text-sm text-white font-medium mt-1">
                      {lowestMonth} - ₹{total.toLocaleString()}
                    </p>
                  );
                })()}
              </div>
            </div>

            <div className="bg-zinc-900/60 p-4 rounded-md border border-zinc-800 flex items-start">
              <div className="p-2 bg-blue-500/10 rounded-md mr-3">
                <BarChart3 className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-zinc-400">Average Monthly Expense</p>
                {(() => {
                  const monthsWithData = months.filter(m => monthlyData[m]?.length > 0);
                  if (monthsWithData.length === 0) return <p className="text-sm text-white">No data</p>;

                  const totalExpense = monthsWithData.reduce((sum, month) => {
                    return sum + monthlyData[month].reduce((monthSum, cat) => monthSum + cat.value, 0);
                  }, 0);

                  const average = totalExpense / monthsWithData.length;

                  return (
                    <p className="text-sm text-white font-medium mt-1">
                      ₹{average.toLocaleString()}
                    </p>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpenseTrendChart;