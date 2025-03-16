'use client'

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CalendarIcon, PieChart } from 'lucide-react';
import axios from 'axios';

import ExpensePieChart from '@/components/Overview/ExpensePieChart';
import ExpenseTrendChart from '@/components/Stats/Trends';
import MonthlyComparisonGrid from '@/components/Stats/MonthComparison';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { getLocalItem} from '@/utils/storage';

const Stats: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthlyData, setMonthlyData] = useState<Record<string, any[]>>({});
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [months, setMonths] = useState<string[]>([]);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Safe localStorage access only on client
    const storedToken = typeof window !== 'undefined' ? getLocalItem('token') : null;
    setToken(storedToken);
    
    // Redirect if no token
    if (!storedToken) {
      toast.error("Login to see Statistics")
      router.push("/sign-in");
    }
  }, [router]);

  useEffect(() => {
    const getLastTwelveMonths = () => {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      const today = new Date();
      const months = [];

      for (let i = 0; i < 12; i++) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthYear = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        months.push(monthYear);
      }

      setMonths(months);
      setSelectedMonth(months[0]); // Current month as default
      return months;
    };

    getLastTwelveMonths();
  }, []);

  // Fetch data for each month
  useEffect(() => {
    const fetchMonthlyData = async () => {
      if (!months.length) return;

      setLoading(true);
      try {
        const data: Record<string, any[]> = {};

        // For each month, fetch category data
        for (const month of months) {
          const [monthName, year] = month.split(' ');
          const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();

          const response = await axios.get(backendUrl + '/api/expenses/categories', {
            params: {
              month: monthIndex + 1, // API expects 1-12
              year: parseInt(year),
            },
            headers: { token }
          },);

          console.log(response)
          // Format data for pie chart
          const formattedData = response.data.categories.map((cat: any) => ({
            name: cat.category,
            value: cat.total,
            color: getCategoryColor(cat.category)
          }));

          data[month] = formattedData;
        }

        setMonthlyData(data);
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError('Failed to load expense data');
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyData();
  }, [months]);

  // Helper function to get consistent colors for categories
  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'Food': '#10B981', // emerald-500
      'Shopping': '#8B5CF6', // violet-500
      'Housing': '#3B82F6', // blue-500
      'Transportation': '#F59E0B', // amber-500
      'Entertainment': '#EC4899', // pink-500
      'Healthcare': '#EF4444', // red-500
      'Utilities': '#6366F1', // indigo-500
      'Education': '#14B8A6', // teal-500
      'Travel': '#F97316', // orange-500
      'Others': '#71717A', // zinc-500
    };

    return colorMap[category] || '#71717A'; // Default to zinc-500
  };

  // Navigate between months
  const navigateMonth = (direction: 'prev' | 'next') => {
    const currentIndex = months.indexOf(selectedMonth);
    if (direction === 'prev' && currentIndex < months.length - 1) {
      setSelectedMonth(months[currentIndex + 1]);
    } else if (direction === 'next' && currentIndex > 0) {
      setSelectedMonth(months[currentIndex - 1]);
    }
  };

  return (
    <div className="p-4 md:p-6 xl:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Monthly Expense Statistics</h1>
          <p className="text-zinc-400">Visualize your spending patterns across different months</p>
        </div>

        {/* Month navigation */}
        <div className="bg-[#0D0D10] rounded-xl border border-zinc-800/50 p-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-white flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5 text-zinc-400" />
              Monthly Breakdown
            </h2>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                disabled={months.indexOf(selectedMonth) === months.length - 1}
                className={`p-1.5 rounded-md border border-zinc-700 ${months.indexOf(selectedMonth) === months.length - 1
                    ? 'text-zinc-600 cursor-not-allowed'
                    : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="px-4 py-1.5 rounded-md bg-zinc-800/50 text-white font-medium">
                {selectedMonth}
              </div>

              <button
                onClick={() => navigateMonth('next')}
                disabled={months.indexOf(selectedMonth) === 0}
                className={`p-1.5 rounded-md border border-zinc-700 ${months.indexOf(selectedMonth) === 0
                    ? 'text-zinc-600 cursor-not-allowed'
                    : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="bg-[#0D0D10] rounded-xl border border-zinc-800/50 p-8 text-center">
            <PieChart className="h-12 w-12 mx-auto mb-4 text-zinc-500" />
            <p className="text-zinc-400 mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-400 hover:text-blue-300"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {/* Selected month pie chart */}
            <div className="bg-[#0D0D10] rounded-xl border border-zinc-800/50 mb-6">
              <div className="p-5 border-b border-zinc-800/70">
                <h2 className="text-lg font-medium text-white">{selectedMonth} Expenses</h2>
              </div>
              <div className="p-4 flex justify-center">
                {monthlyData[selectedMonth]?.length ? (
                  <div className="w-full">
                    <ExpensePieChart data={monthlyData[selectedMonth]} />
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-zinc-400">No expense data available for this month</p>
                  </div>
                )}
              </div>
            </div>

            {/* Monthly Expense Trend Chart Component */}
            <ExpenseTrendChart months={months} monthlyData={monthlyData} />

            {/* Month comparison Component */}
            <div className="mt-6">
              <MonthlyComparisonGrid 
                months={months} 
                monthlyData={monthlyData} 
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Stats;